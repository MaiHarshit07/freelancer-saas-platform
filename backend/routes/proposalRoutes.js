const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  createProposal,
  getProjectProposals,
} = require("../controllers/proposalController");

router.post("/", protect, createProposal);
router.get("/project/:projectId", protect, getProjectProposals);

module.exports = router;
