const prisma = require("../config/prisma");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const { generateOrderNumber } = require("../utils/helpers");

const quoteInclude = {
  customer: true,
  lead: true,
  order: { select: { id: true, orderNumber: true, status: true } },
};

const generateQuoteNumber = () => {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const random = Math.floor(1000 + Math.random() * 9000);
  return `COT-${year}-${random}`;
};

const getQuotes = asyncHandler(async (req, res) => {
  const { status, search = "", page = 1, limit = 20 } = req.query;
  const skip = (Number(page) - 1) * Number(limit);
  const take = Number(limit);

  const where = {
    AND: [
      status ? { status } : {},
      search
        ? {
            OR: [
              { quoteNumber: { contains: search, mode: "insensitive" } },
              { customer: { name: { contains: search, mode: "insensitive" } } },
              { lead: { name: { contains: search, mode: "insensitive" } } },
            ],
          }
        : {},
    ],
  };

  const [quotes, total] = await Promise.all([
    prisma.quote.findMany({
      where,
      include: quoteInclude,
      orderBy: { createdAt: "desc" },
      skip,
      take,
    }),
    prisma.quote.count({ where }),
  ]);

  res.json({
    success: true,
    data: quotes,
    pagination: { total, page: Number(page), limit: take, pages: Math.ceil(total / take) },
  });
});

const getQuoteById = asyncHandler(async (req, res) => {
  const quote = await prisma.quote.findUnique({
    where: { id: Number(req.params.id) },
    include: quoteInclude,
  });
  if (!quote) throw new ApiError(404, "Cotización no encontrada");
  res.json({ success: true, data: quote });
});

const createQuote = asyncHandler(async (req, res) => {
  const { customerId, leadId, items, discount = 0, validDays = 30, notes } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    throw new ApiError(400, "La cotización debe incluir al menos una pieza o servicio");
  }

  let subtotal = 0;
  items.forEach((item) => {
    subtotal += Number(item.unitPrice) * Number(item.quantity);
  });

  const total = subtotal - Number(discount);
  const validUntil = new Date();
  validUntil.setDate(validUntil.getDate() + Number(validDays));

  const quote = await prisma.quote.create({
    data: {
      quoteNumber: generateQuoteNumber(),
      customerId: customerId ? Number(customerId) : null,
      leadId: leadId ? Number(leadId) : null,
      subtotal,
      discount: Number(discount),
      total,
      validUntil,
      notes,
      itemsJson: items,
      status: "BORRADOR",
    },
    include: quoteInclude,
  });

  res.status(201).json({ success: true, data: quote });
});

const updateQuoteStatus = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const { status } = req.body;

  const validStatuses = ["BORRADOR", "ENVIADA", "APROBADA", "RECHAZADA", "EXPIRADA"];
  if (!validStatuses.includes(status)) {
    throw new ApiError(400, "Estado de cotización no válido");
  }

  const quote = await prisma.quote.update({
    where: { id },
    data: { status },
    include: quoteInclude,
  });

  res.json({ success: true, data: quote });
});

const convertQuoteToOrder = asyncHandler(async (req, res) => {
  const quoteId = Number(req.params.id);

  const quote = await prisma.quote.findUnique({
    where: { id: quoteId },
    include: { customer: true, lead: true },
  });

  if (!quote) throw new ApiError(404, "Cotización no encontrada");
  if (quote.orderId) throw new ApiError(409, "Esta cotización ya fue convertida a pedido anteriormente");

  let customerId = quote.customerId;

  // Si la cotización era para un Lead y no tiene Customer asociado, se crea el cliente
  if (!customerId && quote.lead) {
    const customer = await prisma.customer.create({
      data: {
        name: quote.lead.name,
        email: quote.lead.email,
        phone: quote.lead.phone,
        notes: `Convertido desde Lead ID #${quote.lead.id} (${quote.lead.company || ""})`,
      },
    });
    customerId = customer.id;
    await prisma.lead.update({ where: { id: quote.lead.id }, data: { status: "GANADO" } });
  }

  if (!customerId) {
    throw new ApiError(400, "No se puede convertir a pedido sin un cliente registrado");
  }

  const items = Array.isArray(quote.itemsJson) ? quote.itemsJson : [];
  if (items.length === 0) {
    throw new ApiError(400, "La cotización no contiene ítems para crear la orden");
  }

  const order = await prisma.$transaction(async (tx) => {
    const detailsData = [];
    for (const item of items) {
      if (item.productId) {
        const product = await tx.product.findUnique({ where: { id: Number(item.productId) } });
        if (product && product.stock >= item.quantity) {
          await tx.product.update({
            where: { id: product.id },
            data: { stock: { decrement: item.quantity } },
          });
        }
        detailsData.push({
          productId: Number(item.productId),
          quantity: Number(item.quantity),
          unitPrice: Number(item.unitPrice),
          lineTotal: Number(item.quantity) * Number(item.unitPrice),
          finishNotes: item.finishNotes || item.material || null,
        });
      }
    }

    const newOrder = await tx.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        customerId: customerId,
        createdById: req.user.id,
        subtotal: quote.subtotal,
        discount: quote.discount,
        total: quote.total,
        paidAmount: 0,
        notes: `Convertido de Cotización ${quote.quoteNumber}. ${quote.notes || ""}`,
        details: { create: detailsData },
      },
      include: {
        customer: true,
        createdBy: { select: { id: true, name: true } },
        details: { include: { product: true } },
      },
    });

    await tx.quote.update({
      where: { id: quoteId },
      data: { status: "APROBADA", orderId: newOrder.id, customerId },
    });

    return newOrder;
  });

  res.status(201).json({ success: true, data: order });
});

module.exports = {
  getQuotes,
  getQuoteById,
  createQuote,
  updateQuoteStatus,
  convertQuoteToOrder,
};
