const fs = require("fs");
const path = require("path");
const prisma = require("../config/prisma");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");

const buildImageUrl = (req, filename) =>
  `${req.protocol}://${req.get("host")}/uploads/products/${filename}`;

const getProducts = asyncHandler(async (req, res) => {
  const { search = "", category, collection, lowStock, inShowroom, page = 1, limit = 12 } = req.query;
  const skip = (Number(page) - 1) * Number(limit);
  const take = Number(limit);

  const where = {
    AND: [
      search
        ? {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { sku: { contains: search, mode: "insensitive" } },
              { materials: { contains: search, mode: "insensitive" } },
            ],
          }
        : {},
      category ? { categoryId: Number(category) } : {},
      collection ? { collection: { contains: collection, mode: "insensitive" } } : {},
      inShowroom !== undefined ? { inShowroom: inShowroom === "true" } : {},
    ],
  };

  if (lowStock === "true") {
    // Si se requiere filtro de bajo stock, filtramos productos activos
    const allMatching = await prisma.product.findMany({
      where: { ...where, isActive: true },
      include: { category: true },
      orderBy: { stock: "asc" },
    });
    const lowStockItems = allMatching.filter((p) => p.stock <= p.minStock);
    const total = lowStockItems.length;
    const paginated = lowStockItems.slice(skip, skip + take);

    return res.json({
      success: true,
      data: paginated,
      pagination: { total, page: Number(page), limit: take, pages: Math.ceil(total / take) },
    });
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { category: true },
      orderBy: { createdAt: "desc" },
      skip,
      take,
    }),
    prisma.product.count({ where }),
  ]);

  res.json({
    success: true,
    data: products,
    pagination: { total, page: Number(page), limit: take, pages: Math.ceil(total / take) },
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
  const {
    sku,
    name,
    collection,
    description,
    materials,
    dimensions,
    price,
    cost,
    stock,
    minStock,
    categoryId,
    inShowroom,
  } = req.body;

  const imageUrl = req.file ? buildImageUrl(req, req.file.filename) : req.body.imageUrl || null;

  const product = await prisma.product.create({
    data: {
      sku,
      name,
      collection: collection || "Atelier 2026",
      description,
      materials,
      dimensions,
      price: Number(price),
      cost: cost ? Number(cost) : null,
      stock: Number(stock) || 0,
      minStock: Number(minStock) || 3,
      categoryId: Number(categoryId),
      inShowroom: inShowroom === true || inShowroom === "true",
      imageUrl,
    },
    include: { category: true },
  });

  res.status(201).json({ success: true, data: product });
});

const updateProduct = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const {
    sku,
    name,
    collection,
    description,
    materials,
    dimensions,
    price,
    cost,
    stock,
    minStock,
    categoryId,
    inShowroom,
    isActive,
  } = req.body;

  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) throw new ApiError(404, "Producto no encontrado");

  const data = {
    sku,
    name,
    collection,
    description,
    materials,
    dimensions,
    price: price !== undefined ? Number(price) : undefined,
    cost: cost !== undefined ? Number(cost) : undefined,
    stock: stock !== undefined ? Number(stock) : undefined,
    minStock: minStock !== undefined ? Number(minStock) : undefined,
    categoryId: categoryId !== undefined ? Number(categoryId) : undefined,
    inShowroom: inShowroom !== undefined ? inShowroom === true || inShowroom === "true" : undefined,
    isActive: isActive !== undefined ? isActive === true || isActive === "true" : undefined,
  };

  if (req.file) {
    data.imageUrl = buildImageUrl(req, req.file.filename);
    if (existing.imageUrl && existing.imageUrl.includes("/uploads/products/")) {
      const oldFilename = existing.imageUrl.split("/uploads/products/")[1];
      const oldPath = path.join(__dirname, "..", "uploads", "products", oldFilename || "");
      fs.unlink(oldPath, () => {});
    }
  } else if (req.body.imageUrl !== undefined) {
    data.imageUrl = req.body.imageUrl;
  }

  const product = await prisma.product.update({ where: { id }, data, include: { category: true } });
  res.json({ success: true, data: product });
});

const deleteProduct = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);

  const usedInOrders = await prisma.orderDetail.count({ where: { productId: id } });
  if (usedInOrders > 0) {
    await prisma.product.update({ where: { id }, data: { isActive: false } });
    return res.json({ success: true, message: "Pieza con pedidos asociados: se marcó como inactiva en el catálogo" });
  }

  await prisma.product.delete({ where: { id } });
  res.json({ success: true, message: "Pieza eliminada correctamente del catálogo" });
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