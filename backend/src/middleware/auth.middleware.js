const jwt = require("jsonwebtoken");
const ApiError = require("../utils/ApiError");
const prisma = require("../config/prisma");
const authenticate = async (req, res, next)=>{
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
      throw new ApiError(401, "No se proporcionó un token de autenticación");
    }

    const token = header.split(" ")[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        avatarUrl: true,
      },
    });

    if (!user || !user.isActive) {
      throw new ApiError(401, "Usuario no válido o inactivo");
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
      return next(new ApiError(401, "Token inválido o expirado"));
    }
    next(error);
  }
};
const authorize = (...allowedRoles) => (req, res, next) => {
  if (!req.user || !allowedRoles.includes(req.user.role)) {
    return next(new ApiError(403, "No tienes permisos para realizar esta acción"));
  }
  next();
};

module.exports = { authenticate, authorize };