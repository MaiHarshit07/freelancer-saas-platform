const Message = require("../models/Message");
const Project = require("../models/Project");

const sendMessage = async (req, res) => {
  const { projectId, receiverId, content } = req.body;

  const project = await Project.findById(projectId);

  if (!project) {
    return res.status(404).json({
      message: "Project not found",
    });
  }

  const message = await Message.create({
    project: projectId,
    sender: req.user.id,
    receiver: receiverId,
    content,
  });

  res.status(201).json(message);
};
const getProjectMessages = async (req, res) => {
  const project = await Project.findById(req.params.projectId);

  if (!project) {
    return res.status(404).json({
      message: "Project not found",
    });
  }
  // for check of ownership
  // only freelancer and client should watch message
  const isOwner = project.createdBy.toString() === req.user.id;

  const isAssignFl =
    project.assignedFreelancer &&
    project.assignedFreelancer.toString() === req.user.id;

  if (!isOwner && !isAssignFl) {
    return res.status(403).json({
      message: "Access denied",
    });
  }
  const messages = await Message.find({
    project: req.params.projectId,
  })
    .populate("sender", "name role")
    .populate("receiver", "name role")
    .sort({ createdAt: 1 });

  res.json(messages);
};

module.exports = {
  sendMessage,
  getProjectMessages,
};
