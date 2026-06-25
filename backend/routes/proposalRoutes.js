const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  createProposal,
  getProjectProposals,
  acceptProposal,
  getMyProposals,
  getFreelancerDashboard,
} = require("../controllers/proposalController");
const authorizeRoles = require("../middleware/roleMiddleware");

router.post("/", protect, authorizeRoles("freelancer"), createProposal);

router.get("/project/:projectId", protect, getProjectProposals);
router.get("/my-proposals", protect, getMyProposals);
router.get(
  "/dashboard/freelancer",
  protect,
  authorizeRoles("freelancer"),
  getFreelancerDashboard,
);
router.put("/:id/accept", protect, authorizeRoles("client"), acceptProposal);

module.exports = router;
