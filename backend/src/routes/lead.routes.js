const { Router } = require("express");
const {
  getLeads,
  getLeadById,
  createLead,
  updateLead,
  updateLeadStatus,
  deleteLead,
  addLeadActivity,
} = require("../controllers/lead.controller");
const { authenticate } = require("../middleware/auth.middleware");

const router = Router();

router.use(authenticate);

router.route("/").get(getLeads).post(createLead);
router.route("/:id").get(getLeadById).put(updateLead).delete(deleteLead);
router.patch("/:id/status", updateLeadStatus);
router.post("/:id/activities", addLeadActivity);

module.exports = router;
