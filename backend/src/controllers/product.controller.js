const fs = require("fs");
const path = require("path");
const prisma = require("../config/prisma");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");

const buildImageUrl = (req, filename) =>
  `${req.protocol}://${req.get("host")}/uploads/products/${filename}`;

const getProducts = asyncHandler(async (req, res) => {
  const { search = "", category, lowStock, page = 1, limit = 10 } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  const where = {
    AND: [
      search
        ? {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { sku: { contains: search, mode: "insensitive" } },
            ],
          }
        : {},
      category ? { categoryId: Number(category) } : {},
    ],
  };

  let products = await prisma.product.findMany({
    where,
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  if (lowStock === "true") {
    products = products.filter((p) => p.stock <= p.minStock);
  }

  const total = products.length;
  const paginated = products.slice(skip, skip + Number(limit));

  res.json({
    success: true,
    data: paginated,
    pagination: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / limit) },
  });
});

const getProductById = asyncHandler(async (req, res) => {
  const product = await prisma.product.findUnique({
    where: { id: Number(req.params.id) },
    include: { category: true },
  });
  if (!product) throw new ApiError(404, "Producto no encontrado");
  res.json({ success: true, data: product });
});

const createProduct = asyncHandler(async (req, res) => {
  const { sku, name, description, price, cost, stock, minStock, categoryId } = req.body;

  const imageUrl = req.file ? buildImageUrl(req, req.file.filename) : null;

  const product = await prisma.product.create({
    data: {
      sku,
      name,
      description,
      price: Number(price),
      cost: cost ? Number(cost) : null,
      stock: Number(stock) || 0,
      minStock: Number(minStock) || 5,
      categoryId: Number(categoryId),
      imageUrl,
    },
    include: { category: true },
  });

  res.status(201).json({ success: true, data: product });
});

const updateProduct = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const { sku, name, description, price, cost, stock, minStock, categoryId } = req.body;

  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) throw new ApiError(404, "Producto no encontrado");

  const data = {
    sku,
    name,
    description,
    price: price !== undefined ? Number(price) : undefined,
    cost: cost !== undefined ? Number(cost) : undefined,
    stock: stock !== undefined ? Number(stock) : undefined,
    minStock: minStock !== undefined ? Number(minStock) : undefined,
    categoryId: categoryId !== undefined ? Number(categoryId) : undefined,
  };

  if (req.file) {
    data.imageUrl = buildImageUrl(req, req.file.filename);
    if (existing.imageUrl) {
      const oldFilename = existing.imageUrl.split("/uploads/products/")[1];
      const oldPath = path.join(__dirname, "..", "..", "uploads", "products", oldFilename || "");
      fs.unlink(oldPath, () => {}); // best-effort, ignora si no existe
    }
  }

  const product = await prisma.product.update({ where: { id }, data, include: { category: true } });
  res.json({ success: true, data: product });
});

const deleteProduct = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);

  const usedInOrders = await prisma.orderDetail.count({ where: { productId: id } });
  if (usedInOrders > 0) {
    await prisma.product.update({ where: { id }, data: { isActive: false } });
    return res.json({ success: true, message: "Producto con historial de ventas: se marcó como inactivo" });
  }

  await prisma.product.delete({ where: { id } });
  res.json({ success: true, message: "Producto eliminado correctamente" });
});

const getLowStockAlerts = asyncHandler(async (req, res) => {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    include: { category: true },
  });
  const lowStock = products.filter((p) => p.stock <= p.minStock);
  res.json({ success: true, data: lowStock });
});

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getLowStockAlerts,
};