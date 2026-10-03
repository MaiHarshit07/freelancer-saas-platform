const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    type: {
      type: String,
      enum: [
        "proposal_submitted",
        "proposal_accepted",
        "proposal_rejected",
        "new_message",
        "review_received",
        "project_completed",
        "system",
      ],
      default: "system",
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      default: null,
    },

    relatedId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },

    read: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

// Useful for notification lists and unread-count queries
notificationSchema.index({
  recipient: 1,
  createdAt: -1,
});

notificationSchema.index({
  recipient: 1,
  read: 1,
});

module.exports = mongoose.model("Notification", notificationSchema);
