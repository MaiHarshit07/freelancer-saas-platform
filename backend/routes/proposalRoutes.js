const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  createProposal,
  getProjectProposals,
  acceptProposal,
  getMyProposals,
} = require("../controllers/proposalController");
const authorizeRoles = require("../middleware/roleMiddleware");

router.post("/", protect, authorizeRoles("freelancer"), createProposal);

router.get("/project/:projectId", protect, getProjectProposals);
router.get("/my-proposals", protect, getMyProposals);
router.put("/:id/accept", protect, authorizeRoles("client"), acceptProposal);

module.exports = router;
