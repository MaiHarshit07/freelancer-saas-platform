const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  sendMessage,
  getProjectMessages,
  getMyConversations,
} = require("../controllers/messageController");

// Get current user's conversations
router.get("/", protect, getMyConversations);

// Send message
router.post("/", protect, sendMessage);

// Get messages for one project
router.get("/:projectId", protect, getProjectMessages);

module.exports = router;
