const prisma = require("../config/prisma");
const asyncHandler = require("../utils/asyncHandler");
const { dayRange } = require("../utils/helpers");

const getSummary = asyncHandler(async (req, res) => {
  const now = new Date();
  const todayStr = now.toISOString().slice(0, 10);
  const { start: todayStart, end: todayEnd } = dayRange(todayStr);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

  const excludedStatus = "CANCELLED";

  const [
    salesToday,
    salesMonth,
    pendingOrders,
    newCustomersMonth,
    products,
    lastOrders,
  ] = await Promise.all([
    prisma.order.aggregate({
      where: { createdAt: { gte: todayStart, lte: todayEnd }, status: { not: excludedStatus } },
      _sum: { total: true },
      _count: true,
    }),
    prisma.order.aggregate({
      where: { createdAt: { gte: monthStart, lte: monthEnd }, status: { not: excludedStatus } },
      _sum: { total: true },
      _count: true,
    }),
    prisma.order.count({ where: { status: { in: ["PENDING", "CONFIRMED", "IN_PRODUCTION"] } } }),
    prisma.customer.count({ where: { createdAt: { gte: monthStart, lte: monthEnd } } }),
    prisma.product.findMany({ where: { isActive: true } }),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { customer: true },
    }),
  ]);

  const lowStockProducts = products.filter((p) => p.stock <= p.minStock);

  res.json({
    success: true,
    data: {
      salesToday: { total: salesToday._sum.total || 0, count: salesToday._count },
      salesMonth: { total: salesMonth._sum.total || 0, count: salesMonth._count },
      pendingOrders,
      newCustomersMonth,
      lowStockCount: lowStockProducts.length,
      lowStockProducts: lowStockProducts.slice(0, 5),
      lastOrders,
    },
  });
});

const getSalesChart = asyncHandler(async (req, res) => {
  const days = Number(req.query.days) || 14;
  const now = new Date();
  const from = new Date(now);
  from.setDate(from.getDate() - (days - 1));
  from.setHours(0, 0, 0, 0);

  const orders = await prisma.order.findMany({
    where: { createdAt: { gte: from }, status: { not: "CANCELLED" } },
    select: { createdAt: true, total: true },
  });

  const buckets = {};
  for (let i = 0; i < days; i++) {
    const d = new Date(from);
    d.setDate(d.getDate() + i);
    const key = d.toISOString().slice(0, 10);
    buckets[key] = 0;
  }
  orders.forEach((o) => {
    const key = o.createdAt.toISOString().slice(0, 10);
    if (buckets[key] !== undefined) buckets[key] += Number(o.total);
  });

  const series = Object.entries(buckets).map(([date, total]) => ({ date, total }));
  res.json({ success: true, data: series });
});

module.exports = { getSummary, getSalesChart };