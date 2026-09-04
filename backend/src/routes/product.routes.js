const { Router } = require("express");
const { body } = require("express-validator");
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getLowStockAlerts,
} = require("../controllers/product.controller");
const { authenticate, authorize } = require("../middleware/auth.middleware");
const validate = require("../middleware/validate.middleware");
const upload = require("../middleware/upload.middleware");
const router = Router();
router.use(authenticate);
const productValidators = [
  body("sku").trim().notEmpty().withMessage("El SKU es obligatorio"),
  body("name").trim().notEmpty().withMessage("El nombre es obligatorio"),
  body("price").isFloat({ gt: 0 }).withMessage("El precio debe ser mayor a 0"),
  body("categoryId").notEmpty().withMessage("La categoría es obligatoria"),
];

router.get("/", getProducts);
router.get("/alerts/low-stock", getLowStockAlerts);
router.get("/:id", getProductById);

router.post("/", upload.single("image"), productValidators, validate, createProduct);
router.put("/:id", upload.single("image"), updateProduct);
router.delete("/:id", authorize("ADMIN"), deleteProduct);

module.exports = router;