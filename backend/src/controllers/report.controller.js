const prisma = require("../config/prisma");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");

const salesByDateRange = asyncHandler(async (req, res) => {
  const { from, to } = req.query;
  if (!from || !to) throw new ApiError(400, "Debes indicar las fechas 'from' y 'to'");

  const start = new Date(`${from}T00:00:00.000`);
  const end = new Date(`${to}T23:59:59.999`);

  const orders = await prisma.order.findMany({
    where: { createdAt: { gte: start, lte: end }, status: { not: "CANCELLED" } },
    include: { customer: true, details: true },
    orderBy: { createdAt: "asc" },
  });

  const totalSales = orders.reduce((sum, o) => sum + Number(o.total), 0);
  const totalOrders = orders.length;
  const avgTicket = totalOrders ? totalSales / totalOrders : 0;

  res.json({
    success: true,
    data: {
      range: { from, to },
      summary: { totalSales, totalOrders, avgTicket },
      orders: orders.map((o) => ({
        id: o.id,
        orderNumber: o.orderNumber,
        customer: o.customer.name,
        status: o.status,
        total: o.total,
        createdAt: o.createdAt,
        itemsCount: o.details.length,
      })),
    },
  });
});

const topProducts = asyncHandler(async (req, res) => {
  const { from, to, limit = 10 } = req.query;

  const where = { order: { status: { not: "CANCELLED" } } };
  if (from && to) {
    where.order.createdAt = {
      gte: new Date(`${from}T00:00:00.000`),
      lte: new Date(`${to}T23:59:59.999`),
    };
  }

  const details = await prisma.orderDetail.findMany({
    where,
    include: { product: { include: { category: true } } },
  });

  const grouped = {};
  for (const d of details) {
    const key = d.productId;
    if (!grouped[key]) {
      grouped[key] = {
        productId: key,
        name: d.product.name,
        sku: d.product.sku,
        category: d.product.category.name,
        quantitySold: 0,
        revenue: 0,
      };
    }
    grouped[key].quantitySold += d.quantity;
    grouped[key].revenue += Number(d.lineTotal);
  }

  const ranked = Object.values(grouped)
    .sort((a, b) => b.quantitySold - a.quantitySold)
    .slice(0, Number(limit));

  res.json({ success: true, data: ranked });
});

const inventoryReport = asyncHandler(async (req, res) => {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    include: { category: true },
    orderBy: { stock: "asc" },
  });

  const rows = products.map((p) => ({
    sku: p.sku,
    name: p.name,
    category: p.category.name,
    stock: p.stock,
    minStock: p.minStock,
    status: p.stock === 0 ? "AGOTADO" : p.stock <= p.minStock ? "STOCK BAJO" : "NORMAL",
    price: p.price,
    stockValue: Number(p.price) * p.stock,
  }));

  const totals = {
    totalUnits: rows.reduce((s, r) => s + r.stock, 0),
    totalValue: rows.reduce((s, r) => s + r.stockValue, 0),
    lowStockCount: rows.filter((r) => r.status !== "NORMAL").length,
  };

  res.json({ success: true, data: { rows, totals } });
});

module.exports = { salesByDateRange, topProducts, inventoryReport };