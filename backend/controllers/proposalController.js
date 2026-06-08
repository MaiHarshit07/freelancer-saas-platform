const Proposal = require("../models/proposal");
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
const getProjectProposals = async (req, res) => {
  const proposals = await Proposal.find({
    project: req.params.projectId,
  }).populate("freelancer", "name email role");

  res.json(proposals);
};

const acceptProposal = async (req, res) => {
  const proposal = await proposal.findById(req.params.id);

  if (!proposal) {
    return res.status(404).json({
      message: "Proposal Not Found",
    });
  }

  const alreadyAccepted = await Proposal.findOne({
    project: proposal.project,
    status: "accepted",
  });

  if (alreadyAccepted) {
    return res.status(400).json({
      message: "Project already has an accepted proposal",
    });
  }

  proposal.status = "accepted";
  await proposal.save();

  await Proposal.updateMany(
    {
      project: proposal.project,
      _id: { $ne: proposal._id },
    },
    {
      status: "rejected",
    },
  );

  const project = await Project.findById(proposal.project);

  if (project.createdBy.toString() !== req.user.id) {
    return res.status(403).json({
      message: "Only project owner can accept proposals",
    });
  }
  project.status = "in-progress";
  project.assignedFreelancer = proposal.freelancer;
  await project.save();
  res.json({
    message: "Proposal accepted successfully",
  });
};

const getMyProposals = async (req, res) => {
  const proposals = await Proposal.find({
    freelancer: req.user.id,
  })
    .populate("project", "title budget status")
    .populate("freelancer", "name email");

  res.json(proposals);
};

module.exports = {
  createProposal,
  getProjectProposals,
  acceptProposal,
  getMyProposals,
};
