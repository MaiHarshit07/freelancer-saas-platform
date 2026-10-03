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

// ======================================================
// CREATE PROPOSAL
// ======================================================

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

    if (project.status !== "open") {
      return res.status(400).json({
        success: false,
        message: "This project is no longer accepting proposals",
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

    // Notify project owner
    await Notification.create({
      recipient: project.createdBy,
      type: "proposal_submitted",
      message: `${req.user.name} sent a proposal for your project`,
      project: project._id,
      relatedId: proposal._id,
    });

    res.status(201).json({
      success: true,
      message: "Proposal submitted successfully",
      proposal,
    });
  } catch (error) {
    console.error("Create proposal error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================================
// GET PROJECT PROPOSALS
// ======================================================

const getProjectProposals = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    if (project.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Only project owner can view proposals",
      });
    }

    const proposals = await Proposal.find({
      project: req.params.projectId,
    })
      .populate("freelancer", "name email role")
      .populate("project", "title budget status");

    res.status(200).json({
      success: true,
      count: proposals.length,
      data: proposals,
    });
  } catch (error) {
    console.error("Get project proposals error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================================
// ACCEPT PROPOSAL
// ======================================================

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

    // Only project owner can accept
    if (project.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Only project owner can accept proposals",
      });
    }

    if (proposal.status === "rejected") {
      return res.status(400).json({
        success: false,
        message: "Rejected proposal cannot be accepted",
      });
    }

    if (proposal.status === "accepted") {
      return res.status(400).json({
        success: false,
        message: "Proposal is already accepted",
      });
    }

    if (project.status !== "open") {
      return res.status(400).json({
        success: false,
        message: "This project is no longer open",
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

    // --------------------------------------------------
    // Find other pending proposals BEFORE rejecting them
    // --------------------------------------------------

    const rejectedProposals = await Proposal.find({
      project: proposal.project,
      _id: { $ne: proposal._id },
      status: "pending",
    }).select("_id freelancer");

    // --------------------------------------------------
    // Accept selected proposal
    // --------------------------------------------------

    proposal.status = "accepted";

    await proposal.save();

    // --------------------------------------------------
    // Reject all other pending proposals
    // --------------------------------------------------

    await Proposal.updateMany(
      {
        project: proposal.project,
        _id: { $ne: proposal._id },
        status: "pending",
      },
      {
        status: "rejected",
      },
    );

    // --------------------------------------------------
    // Update project
    // --------------------------------------------------

    project.status = "in-progress";
    project.assignedFreelancer = proposal.freelancer;

    await project.save();

    // --------------------------------------------------
    // Notify accepted freelancer
    // --------------------------------------------------

    await Notification.create({
      recipient: proposal.freelancer,
      type: "proposal_accepted",
      message: "Your proposal has been accepted",
      project: project._id,
      relatedId: proposal._id,
    });

    // --------------------------------------------------
    // Notify rejected freelancers
    // --------------------------------------------------

    if (rejectedProposals.length > 0) {
      await Notification.insertMany(
        rejectedProposals.map((item) => ({
          recipient: item.freelancer,
          type: "proposal_rejected",
          message: "Your proposal was not selected for this project",
          project: project._id,
          relatedId: item._id,
        })),
      );
    }

    res.status(200).json({
      success: true,
      message: "Proposal accepted successfully",
      proposal,
    });
  } catch (error) {
    console.error("Accept proposal error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================================
// REJECT PROPOSAL
// ======================================================

const rejectProposal = async (req, res) => {
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

    // Only project owner can reject
    if (project.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Only project owner can reject proposals",
      });
    }

    if (proposal.status === "accepted") {
      return res.status(400).json({
        success: false,
        message: "Accepted proposal cannot be rejected",
      });
    }

    if (proposal.status === "rejected") {
      return res.status(400).json({
        success: false,
        message: "Proposal is already rejected",
      });
    }

    proposal.status = "rejected";

    await proposal.save();

    // Notify freelancer
    await Notification.create({
      recipient: proposal.freelancer,
      type: "proposal_rejected",
      message: "Your proposal has been rejected",
      project: project._id,
      relatedId: proposal._id,
    });

    res.status(200).json({
      success: true,
      message: "Proposal rejected successfully",
      proposal,
    });
  } catch (error) {
    console.error("Reject proposal error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================================
// GET MY PROPOSALS
// ======================================================

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
    console.error("Get my proposals error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================================
// FREELANCER DASHBOARD
// ======================================================

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
    console.error("Freelancer dashboard error:", error);

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
  rejectProposal,
  getMyProposals,
  getFreelancerDashboard,
};
