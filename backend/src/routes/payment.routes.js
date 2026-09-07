const { Router } = require("express");
const { getPayments, createPayment } = require("../controllers/payment.controller");
const { authenticate } = require("../middleware/auth.middleware");

const router = Router();

router.use(authenticate);

router.route("/").get(getPayments).post(createPayment);

module.exports = router;
