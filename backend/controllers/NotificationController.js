const mongoose = require("mongoose");
const Notification = require("../models/Notification");

// GET ALL NOTIFICATIONS
const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      recipient: req.user.id,
    })
      .populate("project", "title status")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Notifications fetched successfully",
      count: notifications.length,
      data: notifications,
    });
  } catch (error) {
    console.error("Get notifications error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch notifications",
    });
  }
};

// GET UNREAD COUNT
const getUnreadNotificationCount = async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      recipient: req.user.id,
      read: false,
    });

    res.status(200).json({
      success: true,
      count,
    });
  } catch (error) {
    console.error("Get unread notification count error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch unread notification count",
    });
  }
};

// MARK ONE NOTIFICATION AS READ
const markNotificationAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid notification ID",
      });
    }

    const notification = await Notification.findOne({
      _id: id,
      recipient: req.user.id,
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    notification.read = true;

    await notification.save();

    res.status(200).json({
      success: true,
      message: "Notification marked as read",
      data: notification,
    });
  } catch (error) {
    console.error("Mark notification as read error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to mark notification as read",
    });
  }
};

// MARK ALL NOTIFICATIONS AS READ
const markAllNotificationsAsRead = async (req, res) => {
  try {
    const result = await Notification.updateMany(
      {
        recipient: req.user.id,
        read: false,
      },
      {
        $set: {
          read: true,
        },
      },
    );

    res.status(200).json({
      success: true,
      message: "All notifications marked as read",
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error("Mark all notifications as read error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to mark all notifications as read",
    });
  }
};

module.exports = {
  getNotifications,
  getUnreadNotificationCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
};
