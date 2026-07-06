const Review = require("../models/Review");
const Project = require("../models/Project");

const createReview = async (req, res) => {
  try {
    const { projectId, rating, comment } = req.body;

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    if (project.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Only project owner can review",
      });
    }

    if (project.status !== "completed") {
      return res.status(400).json({
        success: false,
        message: "Project is not completed",
      });
    }

    const existingReview = await Review.findOne({
      project: projectId,
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "Review already submitted for this project",
      });
    }

    const review = await Review.create({
      project: projectId,
      reviewer: req.user.id,
      freelancer: project.assignedFreelancer,
      rating,
      comment,
    });

    res.status(201).json({
      success: true,
      message: "Review submitted successfully",
      review,
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
    const reviews = await Review.find({
      freelancer: req.params.id,
    }).populate("reviewer", "name");

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
  getFreelancerReviews,
};
