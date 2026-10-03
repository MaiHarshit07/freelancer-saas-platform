const Review = require("../models/Review");
const Project = require("../models/Project");
const Notification = require("../models/Notification");
const mongoose = require("mongoose");

const createReview = async (req, res) => {
  try {
    const { projectId, rating, comment } = req.body;

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({
        success: false,
        message: "A valid project is required",
      });
    }

    const parsedRating = rating;
    const trimmedComment = typeof comment === "string" ? comment.trim() : "";

    if (
      typeof parsedRating !== "number" ||
      !Number.isInteger(parsedRating) ||
      parsedRating < 1 ||
      parsedRating > 5
    ) {
      return res.status(400).json({
        success: false,
        message: "Rating must be an integer from 1 to 5",
      });
    }

    if (trimmedComment.length < 3 || trimmedComment.length > 2000) {
      return res.status(400).json({
        success: false,
        message: "Review text must be between 3 and 2000 characters",
      });
    }

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    if (!project.createdBy || project.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Only the project owner can review the assigned freelancer",
      });
    }

    if (project.status !== "completed") {
      return res.status(400).json({
        success: false,
        message: "Project is not completed",
      });
    }

    if (!project.assignedFreelancer) {
      return res.status(400).json({
        success: false,
        message: "A completed project must have an assigned freelancer",
      });
    }

    const existingReview = await Review.findOne({
      project: projectId,
      reviewer: req.user.id,
    });

    if (existingReview) {
      return res.status(409).json({
        success: false,
        message: "Review already submitted for this project",
      });
    }

    const review = await Review.create({
      project: projectId,
      reviewer: req.user.id,
      freelancer: project.assignedFreelancer,
      rating: parsedRating,
      comment: trimmedComment,
    });

    try {
      await Notification.create({
        recipient: project.assignedFreelancer,
        type: "review_received",
        message: "You received a review for your project",
        project: projectId,
        relatedId: review._id,
      });
    } catch (notificationError) {
      await Review.findByIdAndDelete(review._id);
      throw notificationError;
    }

    res.status(201).json({
      success: true,
      message: "Review submitted successfully",
      review,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "You have already reviewed this project",
      });
    }

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getGivenReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ reviewer: req.user.id })
      .populate("freelancer", "name profileImage")
      .populate("project", "title");

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getFreelancerReviews = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "A valid freelancer is required",
      });
    }

    const reviews = await Review.find({
      freelancer: req.params.id,
    })
      .populate("reviewer", "name profileImage")
      .populate("project", "title");

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);

    const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;

    res.status(200).json({
      success: true,
      count: reviews.length,
      averageRating,
      data: reviews,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createReview,
  getGivenReviews,
  getFreelancerReviews,
};
