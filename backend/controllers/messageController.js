const Message = require("../models/Message");
const Project = require("../models/Project");

const sendMessage = async (req, res) => {
  try {
    const { projectId, receiverId, content } = req.body;

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    const message = await Message.create({
      project: projectId,
      sender: req.user.id,
      receiver: receiverId,
      content,
    });

    res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: message,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getProjectMessages = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // Only project owner or assigned freelancer can view messages
    const isOwner = project.createdBy.toString() === req.user.id;

    const isAssignedFreelancer =
      project.assignedFreelancer &&
      project.assignedFreelancer.toString() === req.user.id;

    if (!isOwner && !isAssignedFreelancer) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const messages = await Message.find({
      project: req.params.projectId,
    })
      .populate("sender", "name role")
      .populate("receiver", "name role")
      .sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      count: messages.length,
      data: messages,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  sendMessage,
  getProjectMessages,
};
