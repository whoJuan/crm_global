const prisma = require("../config/prisma");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");

const getPayments = asyncHandler(async (req, res) => {
  const { orderId } = req.query;

  const where = orderId ? { orderId: Number(orderId) } : {};

  const payments = await prisma.payment.findMany({
    where,
    include: {
      order: {
        include: {
          customer: { select: { id: true, name: true } },
        },
      },
    },
    orderBy: { paymentDate: "desc" },
  });

  res.json({ success: true, data: payments });
});

const createPayment = asyncHandler(async (req, res) => {
  const { orderId, amount, method, reference, notes } = req.body;

  if (!orderId || !amount || Number(amount) <= 0) {
    throw new ApiError(400, "Debes especificar la orden y un monto de pago válido");
  }

  const order = await prisma.order.findUnique({
    where: { id: Number(orderId) },
    include: { payments: true },
  });

  if (!order) throw new ApiError(404, "Pedido no encontrado");

  const result = await prisma.$transaction(async (tx) => {
    const payment = await tx.payment.create({
      data: {
        orderId: Number(orderId),
        amount: Number(amount),
        method: method || "TRANSFERENCIA_BANCARIA",
        reference,
        notes,
      },
    });

    const newPaidAmount = Number(order.paidAmount) + Number(amount);

    // Si la orden estaba en PENDING y recibe un anticipo, pasa a CONFIRMED
    let newStatus = order.status;
    if (order.status === "PENDING" && newPaidAmount > 0) {
      newStatus = "CONFIRMED";
    }

    const updatedOrder = await tx.order.update({
      where: { id: Number(orderId) },
      data: {
        paidAmount: newPaidAmount,
        status: newStatus,
      },
      include: {
        customer: true,
        payments: true,
      },
    });

    return { payment, order: updatedOrder };
  });

  res.status(201).json({ success: true, data: result });
});

module.exports = { getPayments, createPayment };
