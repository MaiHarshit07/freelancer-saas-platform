const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  getNotifications,
  getUnreadNotificationCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} = require("../controllers/notificationController");

// GET ALL NOTIFICATIONS
router.get("/", protect, getNotifications);

// GET UNREAD COUNT
router.get("/unread-count", protect, getUnreadNotificationCount);

// MARK ALL AS READ
router.put("/read-all", protect, markAllNotificationsAsRead);

// MARK ONE AS READ
router.put("/:id/read", protect, markNotificationAsRead);

module.exports = router;
