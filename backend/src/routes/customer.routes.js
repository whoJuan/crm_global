const { Router } = require("express");
const { body } = require("express-validator");
const {
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} = require("../controllers/customer.controller");
const { authenticate, authorize } = require("../middleware/auth.middleware");
const validate = require("../middleware/validate.middleware");
const router = Router();
router.use(authenticate);
const customerValidators = [
  body("name").trim().notEmpty().withMessage("El nombre es obligatorio"),
  body("phone").trim().notEmpty().withMessage("El teléfono es obligatorio"),
  body("email").optional({ values: "falsy" }).isEmail().withMessage("Correo no válido"),
];
router.get("/", getCustomers);
router.get("/:id", getCustomerById);
router.post("/", customerValidators, validate, createCustomer);
router.put("/:id", customerValidators, validate, updateCustomer);
router.delete("/:id", authorize("ADMIN"), deleteCustomer);

module.exports = router;