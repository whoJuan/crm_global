const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
const apiRoutes = require("./routes");
const { errorHandler, notFound } = require("./middleware/error.middleware");
const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN?.split(",") || "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== "test") {
  app.use(morgan("dev"));
}

// Archivos estáticos
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));
app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "API del CRM de muebles operativa" });
});

app.use("/api", apiRoutes);
app.use(notFound);
app.use(errorHandler);
module.exports = app;