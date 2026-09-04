const prisma = require("../config/prisma");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");

/** GET /api/categories */
const getCategories = asyncHandler(async (req, res) => {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { products: true } } },
  });
  res.json({ success: true, data: categories });
});

/** POST /api/categories */
const createCategory = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  const category = await prisma.category.create({ data: { name, description } });
  res.status(201).json({ success: true, data: category });
});

/** PUT /api/categories/:id */
const updateCategory = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const { name, description } = req.body;
  const category = await prisma.category.update({ where: { id }, data: { name, description } });
  res.json({ success: true, data: category });
});

const deleteCategory = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const productsCount = await prisma.product.count({ where: { categoryId: id } });
  if (productsCount > 0) {
    throw new ApiError(409, "No se puede eliminar una categoría con productos asociados");
  }
  await prisma.category.delete({ where: { id } });
  res.json({ success: true, message: "Categoría eliminada correctamente" });
});

module.exports = { getCategories, createCategory, updateCategory, deleteCategory };