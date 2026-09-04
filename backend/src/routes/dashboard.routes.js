const { Router } = require("express");
const { getSummary, getSalesChart } = require("../controllers/dashboard.controller");
const { authenticate } = require("../middleware/auth.middleware");

const router = Router();

router.use(authenticate);
router.get("/summary", getSummary);
router.get("/sales-chart", getSalesChart);

module.exports = router;