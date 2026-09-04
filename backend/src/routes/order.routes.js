const { Router } = require("express");
const { body } = require("express-validator");
const {
  getOrders,
  getOrderById,
  createOrder,
  updateOrder,
  updateOrderStatus,
  deleteOrder,
} = require("../controllers/order.controller");
const { authenticate, authorize } = require("../middleware/auth.middleware");
const validate = require("../middleware/validate.middleware");
const router = Router();
router.use(authenticate);

router.get("/", getOrders);
router.get("/:id", getOrderById);

router.post(
  "/",
  [
    body("customerId").notEmpty().withMessage("El cliente es obligatorio"),
    body("items").isArray({ min: 1 }).withMessage("El pedido debe tener al menos un producto"),
  ],
  validate,
  createOrder
);
router.put("/:id", updateOrder);
router.patch(
  "/:id/status",
  [body("status").notEmpty().withMessage("El estado es obligatorio")],
  validate,
  updateOrderStatus
);

router.delete("/:id", authorize("ADMIN"), deleteOrder);

module.exports = router;