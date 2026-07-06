const mongoose = require("mongoose");
const Proposal = require("../models/Proposal");
const Project = require("../models/Project");
const Notification = require("../models/Notification");

const getProjectIdFromRequest = (req) => {
  return (
    req.body?.projectId ||
    req.body?.project ||
    req.params?.projectId ||
    req.params?.id ||
    req.query?.projectId ||
    req.query?.project
  );
};

const createProposal = async (req, res) => {
  try {
    const { coverLetter, bidAmount } = req.body;
    const projectId = getProjectIdFromRequest(req);

    if (!projectId) {
      return res.status(400).json({
        success: false,
        message: "Project ID is required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid project ID",
      });
    }

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    const existingProposal = await Proposal.findOne({
      project: projectId,
      freelancer: req.user.id,
    });

    if (existingProposal) {
      return res.status(400).json({
        success: false,
        message: "You have already applied to this project",
      });
    }

    const proposal = await Proposal.create({
      project: projectId,
      freelancer: req.user.id,
      coverLetter,
      bidAmount,
    });

    await Notification.create({
      recipient: project.createdBy,
      message: `${req.user.name} sent a proposal for your project`,
    });

    res.status(201).json({
      success: true,
      message: "Proposal submitted successfully",
      proposal,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getProjectProposals = async (req, res) => {
  try {
    const proposals = await Proposal.find({
      project: req.params.projectId,
    }).populate("freelancer", "name email role");

    res.status(200).json({
      success: true,
      count: proposals.length,
      data: proposals,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const acceptProposal = async (req, res) => {
  try {
    const proposal = await Proposal.findById(req.params.id);

    if (!proposal) {
      return res.status(404).json({
        success: false,
        message: "Proposal not found",
      });
    }

    const project = await Project.findById(proposal.project);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    if (project.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Only project owner can accept proposals",
      });
    }

    const alreadyAccepted = await Proposal.findOne({
      project: proposal.project,
      status: "accepted",
    });

    if (alreadyAccepted) {
      return res.status(400).json({
        success: false,
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

    project.status = "in-progress";
    project.assignedFreelancer = proposal.freelancer;

    await project.save();

    await Notification.create({
      recipient: proposal.freelancer,
      message: "Your proposal has been accepted",
    });

    res.status(200).json({
      success: true,
      message: "Proposal accepted successfully",
      proposal,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getMyProposals = async (req, res) => {
  try {
    const proposals = await Proposal.find({
      freelancer: req.user.id,
    })
      .populate("project", "title budget status")
      .populate("freelancer", "name email");

    res.status(200).json({
      success: true,
      count: proposals.length,
      data: proposals,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getFreelancerDashboard = async (req, res) => {
  try {
    const proposals = await Proposal.find({
      freelancer: req.user.id,
    });

    const totalProposals = proposals.length;

    const acceptedProposals = proposals.filter(
      (proposal) => proposal.status === "accepted",
    ).length;

    const pendingProposals = proposals.filter(
      (proposal) => proposal.status === "pending",
    ).length;

    const rejectedProposals = proposals.filter(
      (proposal) => proposal.status === "rejected",
    ).length;

    res.status(200).json({
      success: true,
      dashboard: {
        totalProposals,
        acceptedProposals,
        pendingProposals,
        rejectedProposals,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createProposal,
  getProjectProposals,
  acceptProposal,
  getMyProposals,
  getFreelancerDashboard,
};
