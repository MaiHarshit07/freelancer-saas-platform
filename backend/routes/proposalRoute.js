const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const { createProposal } = require("../controllers/proposalController");

router.post("/", protect, createProposal);

module.exports = router;
