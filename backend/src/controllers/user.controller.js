const bcrypt = require("bcrypt");
const prisma = require("../config/prisma");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");

const userSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  isActive: true,
  avatarUrl: true,
  createdAt: true,
};

const getUsers = asyncHandler(async (req, res) => {
  const users = await prisma.user.findMany({
    select: userSelect,
    orderBy: { createdAt: "desc" },
  });
  res.json({ success: true, data: users });
});

const getUserById = asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: Number(req.params.id) },
    select: userSelect,
  });
  if (!user) throw new ApiError(404, "Usuario no encontrado");
  res.json({ success: true, data: user });
});

const createUser=asyncHandler(async (req, res) => {
  const { name,email,password,role}=req.body;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new ApiError(409, "Ya existe un usuario con ese correo");

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { name, email, passwordHash, role: role || "EMPLOYEE" },
    select: userSelect,
  });

  res.status(201).json({ success: true, data: user });
});

/** PUT /api/users/:id */
const updateUser = asyncHandler(async (req,res)=>{
  const id = Number(req.params.id);
  const { name,email,role,isActive,password}=req.body;

  const data = {name,email,role,isActive};
  if (password) {
    data.passwordHash = await bcrypt.hash(password, 10);
  }

  const user = await prisma.user.update({
    where: { id },
    data,
    select: userSelect,
  });

  res.json({ success: true, data: user });
});

const deleteUser = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);

  if (req.user.id === id) {
    throw new ApiError(400, "No puedes desactivar tu propia cuenta");
  }

  await prisma.user.update({ where: { id }, data: { isActive: false } });
  res.json({ success: true, message: "Usuario desactivado correctamente" });
});

module.exports = { getUsers, getUserById, createUser, updateUser, deleteUser };