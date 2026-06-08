const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  sendMessage,
  getProjectMessages,
} = require("../controllers/messageController");

router.post("/", protect, sendMessage);
router.get("/:projectId", protect, getProjectMessages);

module.exports = router;
