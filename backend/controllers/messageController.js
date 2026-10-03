const Message = require("../models/Message");
const Project = require("../models/Project");
const Notification = require("../models/Notification");

// ==========================================
// SEND MESSAGE
// ==========================================

const sendMessage = async (req, res) => {
  try {
    const { projectId, receiverId, content } = req.body;

    // --------------------------------------
    // BASIC VALIDATION
    // --------------------------------------

    if (!projectId || !receiverId || !content?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Project, receiver and message content are required",
      });
    }

    // --------------------------------------
    // FIND PROJECT
    // --------------------------------------

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    const currentUserId = req.user.id;

    // --------------------------------------
    // PROJECT MUST BE IN PROGRESS
    // --------------------------------------

    if (project.status !== "in-progress") {
      return res.status(403).json({
        success: false,
        message: "Messaging is available only for active projects",
      });
    }

    // --------------------------------------
    // CHECK CURRENT USER
    // --------------------------------------

    const isOwner = project.createdBy.toString() === currentUserId;

    const isAssignedFreelancer =
      project.assignedFreelancer &&
      project.assignedFreelancer.toString() === currentUserId;

    if (!isOwner && !isAssignedFreelancer) {
      return res.status(403).json({
        success: false,
        message: "Only the project owner and assigned freelancer can message",
      });
    }

    // --------------------------------------
    // CHECK RECEIVER
    // --------------------------------------

    const isReceiverOwner = project.createdBy.toString() === receiverId;

    const isReceiverAssignedFreelancer =
      project.assignedFreelancer &&
      project.assignedFreelancer.toString() === receiverId;

    if (!isReceiverOwner && !isReceiverAssignedFreelancer) {
      return res.status(403).json({
        success: false,
        message: "Receiver is not part of this project",
      });
    }

    // --------------------------------------
    // PREVENT SELF MESSAGE
    // --------------------------------------

    if (receiverId === currentUserId) {
      return res.status(400).json({
        success: false,
        message: "You cannot send a message to yourself",
      });
    }

    // --------------------------------------
    // CREATE MESSAGE
    // --------------------------------------

    const message = await Message.create({
      project: projectId,
      sender: currentUserId,
      receiver: receiverId,
      content: content.trim(),
    });

    await Notification.create({
      recipient: receiverId,
      type: "new_message",
      message: `${req.user.name || "Someone"} sent you a message`,
      project: projectId,
      relatedId: message._id,
    });

    // --------------------------------------
    // POPULATE MESSAGE
    // --------------------------------------

    const populatedMessage = await Message.findById(message._id)
      .populate("sender", "name email role")
      .populate("receiver", "name email role");

    // --------------------------------------
    // RESPONSE
    // --------------------------------------

    return res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: populatedMessage,
    });
  } catch (error) {
    console.error("Send message error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// GET PROJECT MESSAGES
// ==========================================

const getProjectMessages = async (req, res) => {
  try {
    const { projectId } = req.params;

    // --------------------------------------
    // FIND PROJECT
    // --------------------------------------

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    const currentUserId = req.user.id;

    // --------------------------------------
    // PROJECT MUST BE IN PROGRESS
    // --------------------------------------

    if (project.status !== "in-progress") {
      return res.status(403).json({
        success: false,
        message: "Messaging is available only for active projects",
      });
    }

    // --------------------------------------
    // AUTHORIZATION
    // --------------------------------------

    const isOwner = project.createdBy.toString() === currentUserId;

    const isAssignedFreelancer =
      project.assignedFreelancer &&
      project.assignedFreelancer.toString() === currentUserId;

    if (!isOwner && !isAssignedFreelancer) {
      return res.status(403).json({
        success: false,
        message:
          "Only the project owner and assigned freelancer can view messages",
      });
    }

    // --------------------------------------
    // GET MESSAGES
    // --------------------------------------

    const messages = await Message.find({
      project: projectId,
    })
      .populate("sender", "name email role")
      .populate("receiver", "name email role")
      .sort({
        createdAt: 1,
      });

    // --------------------------------------
    // RESPONSE
    // --------------------------------------

    return res.status(200).json({
      success: true,
      count: messages.length,
      data: messages,
    });
  } catch (error) {
    console.error("Get project messages error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// GET MY CONVERSATIONS
// ==========================================

const getMyConversations = async (req, res) => {
  try {
    const currentUserId = req.user.id;

    const messages = await Message.find({
      $or: [{ sender: currentUserId }, { receiver: currentUserId }],
    })
      .populate("project", "title status createdBy assignedFreelancer")
      .populate("sender", "name email role")
      .populate("receiver", "name email role")
      .sort({
        createdAt: -1,
      });

    const conversationsMap = new Map();

    for (const message of messages) {
      if (!message.project) {
        continue;
      }

      // ------------------------------------
      // ONLY ACTIVE PROJECT CONVERSATIONS
      // ------------------------------------

      if (message.project.status !== "in-progress") {
        continue;
      }

      // ------------------------------------
      // AUTHORIZATION
      // ------------------------------------

      const isOwner = message.project.createdBy?.toString() === currentUserId;

      const isAssignedFreelancer =
        message.project.assignedFreelancer?.toString() === currentUserId;

      if (!isOwner && !isAssignedFreelancer) {
        continue;
      }

      // ------------------------------------
      // ONE CONVERSATION PER PROJECT
      // ------------------------------------

      const projectId = message.project._id.toString();

      if (!conversationsMap.has(projectId)) {
        const isSender = message.sender._id.toString() === currentUserId;

        const otherUser = isSender ? message.receiver : message.sender;

        conversationsMap.set(projectId, {
          project: message.project,
          otherUser,
          latestMessage: message,
        });
      }
    }

    const conversations = Array.from(conversationsMap.values());

    return res.status(200).json({
      success: true,
      count: conversations.length,
      data: conversations,
    });
  } catch (error) {
    console.error("Get conversations error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  sendMessage,
  getProjectMessages,
  getMyConversations,
};
