const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  getNotifications,
  markNotificationAsRead,
} = require("../controllers/notificationController");

router.get("/", protect, getNotifications);
router.put("/:id/read", protect, markNotificationAsRead);

module.exports = router;
