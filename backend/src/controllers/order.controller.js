const prisma = require("../config/prisma");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const { generateOrderNumber } = require("../utils/helpers");

const orderInclude = {
  customer: true,
  createdBy: { select: { id: true, name: true, email: true } },
  details: { include: { product: true } },
};

const getOrders = asyncHandler(async (req, res) => {
  const { search = "", status, page = 1, limit = 10 } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  const where = {
    AND: [
      status ? { status } : {},
      search
        ? {
            OR: [
              { orderNumber: { contains: search, mode: "insensitive" } },
              { customer: { name: { contains: search, mode: "insensitive" } } },
            ],
          }
        :{},
    ],
  };

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: orderInclude,
      orderBy: { createdAt: "desc" },
      skip,
      take: Number(limit),
    }),
    prisma.order.count({ where }),
  ]);

  res.json({
    success: true,
    data: orders,
    pagination: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / limit) },
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
  const { customerId, discount = 0, notes, deliveryDate, items } = req.body;

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
      });

      await tx.product.update({
        where: { id: product.id },
        data: { stock: { decrement: item.quantity } },
      });
    }

    const total = subtotal - Number(discount);

    return tx.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        customerId: Number(customerId),
        createdById: req.user.id,
        subtotal,
        discount: Number(discount),
        total,
        notes,
        deliveryDate: deliveryDate ? new Date(deliveryDate) : null,
        details: { create: detailsData },
      },
      include: orderInclude,
    });
  });

  res.status(201).json({ success: true, data: order });
});

const updateOrder = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const { customerId, discount, notes, deliveryDate } = req.body;

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
      deliveryDate: deliveryDate ? new Date(deliveryDate) : undefined,
    },
    include: orderInclude,
  });

  res.json({ success: true, data: order });
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const { status } = req.body;

  const validStatuses = ["PENDING", "CONFIRMED", "IN_PRODUCTION", "SHIPPED", "DELIVERED", "CANCELLED"];
  if (!validStatuses.includes(status)) {
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
      await tx.order.update({ where: { id }, data: { status } });
    });
  } else {
    await prisma.order.update({ where: { id }, data: { status } });
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