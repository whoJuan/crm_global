const ApiError = require("../utils/ApiError");

const errorHandler = (err, req, res, next) => {
  // Errores de negocio controlados
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      details: err.details || undefined,
    });
  }

  if (err.code === "P2002") {
    const field = err.meta?.target?.join(", ") || "campo";
    return res.status(409).json({
      success: false,
      message: `Ya existe un registro con ese valor en: ${field}`,
    });
  }

  if (err.code === "P2003") {
    return res.status(409).json({
      success: false,
      message: "La operación viola una relación con otro registro (llave foránea)",
    });
  }

  if (err.code === "P2025") {
    return res.status(404).json({
      success: false,
      message: "El registro solicitado no existe",
    });
  }

  if (err.name === "MulterError") {
    return res.status(400).json({ success: false, message: err.message });
  }

  console.error("Error no controlado:", err);
  return res.status(500).json({
    success: false,
    message: "Error interno del servidor",
  });
};

const notFound = (req, res) => {
  res.status(404).json({ success: false, message: `Ruta no encontrada: ${req.originalUrl}` });
};

module.exports = { errorHandler, notFound };