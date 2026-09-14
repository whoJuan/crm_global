const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
const fs = require("fs");
const apiRoutes = require("./src/routes/index");
const { errorHandler, notFound } = require("./src/middleware/error.middleware");

const app = express();

// Asegurar directorio de uploads
try {
  const uploadsDir = path.join(__dirname, "uploads", "products");
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
} catch (error) {
  // Ignorar en entornos de solo lectura (ej. Serverless en Vercel)
}

app.use(cors({ origin: process.env.CORS_ORIGIN?.split(",") || "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== "test") {
  app.use(morgan("dev"));
}

// Archivos estáticos
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Robledo Atelier CRM API v2 operativa",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api", apiRoutes);
app.use(notFound);
app.use(errorHandler);

module.exports = app;