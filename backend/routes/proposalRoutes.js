const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  createProposal,
  getProjectProposals,
  acceptProposal,
} = require("../controllers/proposalController");

router.post("/", protect, createProposal);

router.get("/project/:projectId", protect, getProjectProposals);
router.put("/:id/accept", protect, acceptProposal);

module.exports = router;
