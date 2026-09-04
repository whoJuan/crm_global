const { Router } = require("express");
const { body } = require("express-validator");
const {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/category.controller");
const { authenticate, authorize } = require("../middleware/auth.middleware");
const validate = require("../middleware/validate.middleware");
const router = Router();
router.use(authenticate);
router.get("/", getCategories);
router.post(
  "/",
  authorize("ADMIN"),
  [body("name").trim().notEmpty().withMessage("El nombre es obligatorio")],
  validate,
  createCategory
);
router.put("/:id", authorize("ADMIN"), updateCategory);
router.delete("/:id", authorize("ADMIN"), deleteCategory);

module.exports = router;