const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  createProposal,
  getProjectProposals,
  acceptProposal,
  getMyProposals,
} = require("../controllers/proposalController");

router.post("/", protect, createProposal);

router.get("/project/:projectId", protect, getProjectProposals);
router.get("/my-proposals", protect, getMyProposals);
router.put("/:id/accept", protect, acceptProposal);

module.exports = router;
