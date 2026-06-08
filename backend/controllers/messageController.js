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
