const { Router } = require("express");
const {
  getQuotes,
  getQuoteById,
  createQuote,
  updateQuoteStatus,
  convertQuoteToOrder,
} = require("../controllers/quote.controller");
const { authenticate } = require("../middleware/auth.middleware");

const router = Router();

router.use(authenticate);

router.route("/").get(getQuotes).post(createQuote);
router.route("/:id").get(getQuoteById);
router.patch("/:id/status", updateQuoteStatus);
router.post("/:id/convert", convertQuoteToOrder);

module.exports = router;
