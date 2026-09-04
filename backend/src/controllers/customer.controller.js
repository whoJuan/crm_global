const prisma = require("../config/prisma");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const getCustomers = asyncHandler(async (req, res) => {
  const { search = "", page = 1, limit = 10 } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  const where = search
    ? {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
          { phone: { contains: search, mode: "insensitive" } },
        ],
      }
    : {};

  const [customers, total] = await Promise.all([
    prisma.customer.findMany({
      where,
      skip,
      take: Number(limit),
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { orders: true } } },
    }),
    prisma.customer.count({ where }),
  ]);

  res.json({
    success: true,
    data: customers,
    pagination: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / limit) },
  });
});

const getCustomerById = asyncHandler(async (req, res) => {
  const customer = await prisma.customer.findUnique({
    where: { id: Number(req.params.id) },
    include: {
      orders: {
        orderBy: { createdAt: "desc" },
        include: { details: { include: { product: true } } },
      },
    },
  });

  if (!customer) throw new ApiError(404, "Cliente no encontrado");
  res.json({ success: true, data: customer });
});

const createCustomer = asyncHandler(async (req, res) => {
  const { name, email, phone, address, city, documentId, notes } = req.body;

  const customer = await prisma.customer.create({
    data: { name, email: email || null, phone, address, city, documentId, notes },
  });

  res.status(201).json({ success: true, data: customer });
});

const updateCustomer = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const { name, email, phone, address, city, documentId, notes } = req.body;

  const customer = await prisma.customer.update({
    where: { id },
    data: { name, email: email || null, phone, address, city, documentId, notes },
  });

  res.json({ success: true, data: customer });
});

const deleteCustomer = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);

  const ordersCount = await prisma.order.count({ where: { customerId: id } });
  if (ordersCount > 0) {
    throw new ApiError(409, "No se puede eliminar un cliente con pedidos asociados");
  }

  await prisma.customer.delete({ where: { id } });
  res.json({ success: true, message: "Cliente eliminado correctamente" });
});

module.exports = { getCustomers, getCustomerById, createCustomer, updateCustomer, deleteCustomer };