const { PrismaClient } = require("@prisma/client");

// Instancia única de Prisma reutilizada en toda la app (evita agotar
// el pool de conexiones en desarrollo con hot-reload).
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
});

module.exports = prisma;