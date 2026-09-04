const { Router } = require("express");
const { salesByDateRange, topProducts, inventoryReport } = require("../controllers/report.controller");
const { authenticate } = require("../middleware/auth.middleware");

const router = Router();

router.use(authenticate);

router.get("/sales", salesByDateRange);
router.get("/top-products", topProducts);
router.get("/inventory", inventoryReport);

module.exports = router;