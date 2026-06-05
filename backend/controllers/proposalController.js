const Proposal = require("../models/Proposal");
const Project = require("../models/Project");

const createProposal = async (req, res) => {
  const { projectId, coverLetter, bidAmount } = req.body;

  const project = await Project.findById(projectId);
  // =========================== //
  const existingProposal = await Proposal.findOne({
    project: projectId,
    freelancer: req.user.id,
  });

  if (existingProposal) {
    return res.status(400).json({
      message: "You have already applied to this project",
    });
  }
  if (!project) {
    return res.status(404).json({
      message: "Project not found",
    });
  }

  const proposal = await Proposal.create({
    project: projectId,
    freelancer: req.user.id,
    coverLetter,
    bidAmount,
  });

  res.status(201).json(proposal);
};

module.exports = {
  createProposal,
};
