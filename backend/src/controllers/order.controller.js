const prisma = require("../config/prisma");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const { generateOrderNumber } = require("../utils/helpers");

const orderInclude = {
  customer: true,
  createdBy: { select: { id: true, name: true, email: true } },
  details: { include: { product: true } },
  payments: { orderBy: { paymentDate: "desc" } },
};

const getOrders = asyncHandler(async (req, res) => {
  const { search = "", status, workshopStage, customerId, page = 1, limit = 15 } = req.query;
  const skip = (Number(page) - 1) * Number(limit);
  const take = Number(limit);

  const where = {
    AND: [
      status ? { status } : {},
      workshopStage ? { workshopStage } : {},
      customerId ? { customerId: Number(customerId) } : {},
      search
        ? {
            OR: [
              { orderNumber: { contains: search, mode: "insensitive" } },
              { customer: { name: { contains: search, mode: "insensitive" } } },
              { craftsmanName: { contains: search, mode: "insensitive" } },
            ],
          }
        : {},
    ],
  };

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: orderInclude,
      orderBy: { createdAt: "desc" },
      skip,
      take,
    }),
    prisma.order.count({ where }),
  ]);

  res.json({
    success: true,
    data: orders,
    pagination: { total, page: Number(page), limit: take, pages: Math.ceil(total / take) },
  });
});

const getOrderById = asyncHandler(async (req, res) => {
  const order = await prisma.order.findUnique({
    where: { id: Number(req.params.id) },
    include: orderInclude,
  });
  if (!order) throw new ApiError(404, "Pedido no encontrado");
  res.json({ success: true, data: order });
});

const createOrder = asyncHandler(async (req, res) => {
  const { customerId, discount = 0, notes, deliveryDate, items, workshopStage, craftsmanName, initialDeposit = 0, paymentMethod } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    throw new ApiError(400, "El pedido debe incluir al menos un producto");
  }

  const order = await prisma.$transaction(async (tx) => {
    let subtotal = 0;
    const detailsData = [];

    for (const item of items) {
      const product = await tx.product.findUnique({ where: { id: Number(item.productId) } });
      if (!product) throw new ApiError(404, `Producto ${item.productId} no encontrado`);
      if (product.stock < item.quantity) {
        throw new ApiError(409, `Stock insuficiente para "${product.name}" (disponible: ${product.stock})`);
      }

      const lineTotal = Number(product.price) * item.quantity;
      subtotal += lineTotal;

      detailsData.push({
        productId: product.id,
        quantity: item.quantity,
        unitPrice: product.price,
        lineTotal,
        finishNotes: item.finishNotes || null,
      });

      await tx.product.update({
        where: { id: product.id },
        data: { stock: { decrement: item.quantity } },
      });
    }

    const total = subtotal - Number(discount);
    const depositNum = Number(initialDeposit) || 0;

    const createdOrder = await tx.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        customerId: Number(customerId),
        createdById: req.user.id,
        subtotal,
        discount: Number(discount),
        total,
        paidAmount: depositNum,
        status: depositNum > 0 ? "CONFIRMED" : "PENDING",
        workshopStage: workshopStage || "Estructura de Madera",
        craftsmanName: craftsmanName || null,
        notes,
        deliveryDate: deliveryDate ? new Date(deliveryDate) : null,
        details: { create: detailsData },
      },
      include: orderInclude,
    });

    if (depositNum > 0) {
      await tx.payment.create({
        data: {
          orderId: createdOrder.id,
          amount: depositNum,
          method: paymentMethod || "TRANSFERENCIA_BANCARIA",
          notes: "Anticipo inicial para inicio de fabricación",
        },
      });
    }

    return createdOrder;
  });

  res.status(201).json({ success: true, data: order });
});

const updateOrder = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const { customerId, discount, notes, deliveryDate, workshopStage, craftsmanName } = req.body;

  const existing = await prisma.order.findUnique({ where: { id } });
  if (!existing) throw new ApiError(404, "Pedido no encontrado");

  const newDiscount = discount !== undefined ? Number(discount) : Number(existing.discount);
  const total = Number(existing.subtotal) - newDiscount;

  const order = await prisma.order.update({
    where: { id },
    data: {
      customerId: customerId ? Number(customerId) : undefined,
      discount: newDiscount,
      total,
      notes,
      workshopStage,
      craftsmanName,
      deliveryDate: deliveryDate ? new Date(deliveryDate) : undefined,
    },
    include: orderInclude,
  });

  res.json({ success: true, data: order });
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const { status, workshopStage } = req.body;

  const validStatuses = ["PENDING", "CONFIRMED", "IN_PRODUCTION", "QUALITY_CHECK", "SHIPPED", "DELIVERED", "CANCELLED"];
  if (status && !validStatuses.includes(status)) {
    throw new ApiError(400, "Estado de pedido no válido");
  }

  const existing = await prisma.order.findUnique({ where: { id }, include: { details: true } });
  if (!existing) throw new ApiError(404, "Pedido no encontrado");

  if (status === "CANCELLED" && existing.status !== "CANCELLED") {
    await prisma.$transaction(async (tx) => {
      for (const detail of existing.details) {
        await tx.product.update({
          where: { id: detail.productId },
          data: { stock: { increment: detail.quantity } },
        });
      }
      await tx.order.update({
        where: { id },
        data: { status, workshopStage: "Cancelado" },
      });
    });
  } else {
    await prisma.order.update({
      where: { id },
      data: {
        status: status || undefined,
        workshopStage: workshopStage || undefined,
      },
    });
  }

  const order = await prisma.order.findUnique({ where: { id }, include: orderInclude });
  res.json({ success: true, data: order });
});

const deleteOrder = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const existing = await prisma.order.findUnique({ where: { id }, include: { details: true } });
  if (!existing) throw new ApiError(404, "Pedido no encontrado");

  await prisma.$transaction(async (tx) => {
    for (const detail of existing.details) {
      await tx.product.update({
        where: { id: detail.productId },
        data: { stock: { increment: detail.quantity } },
      });
    }
    await tx.order.delete({ where: { id } });
  });

  res.json({ success: true, message: "Pedido eliminado y stock restituido" });
});

module.exports = {
  getOrders,
  getOrderById,
  createOrder,
  updateOrder,
  updateOrderStatus,
  deleteOrder,
};