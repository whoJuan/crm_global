const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const prisma = require("../config/prisma.js");
const asyncHandler = require("../utils/asyncHandler.js");
const ApiError = require("../utils/ApiError");
const SALT_ROUNDS = 10;
const signToken = (user) =>
  jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "8h",
  });

const sanitizeUser = (user) => {
  const { passwordHash, ...rest } = user;
  return rest;
};
const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new ApiError(409, "Ya existe un usuario registrado con ese correo");
  }

  const usersCount = await prisma.user.count();
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
 
      role: usersCount === 0 ? "ADMIN" : role === "ADMIN" ? "ADMIN" : "EMPLOYEE",
    },
  });

  const token = signToken(user);
  res.status(201).json({ success: true, data: { user: sanitizeUser(user), token } });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.isActive) {
    throw new ApiError(401, "Credenciales inválidas");
  }

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) {
    throw new ApiError(401, "Credenciales inválidas");
  }

  const token = signToken(user);
  res.json({ success: true, data: { user: sanitizeUser(user), token } });
});

const me = asyncHandler(async (req, res) => {
  res.json({ success: true, data: req.user });
});

module.exports = { register, login, me };