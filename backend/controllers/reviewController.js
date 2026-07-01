const Review = require("../models/Review");
const Project = require("../models/project");

const createReview = async (req, res) => {
  const { projectId, rating, comment } = req.body;

  // validation
  const project = await Project.findById(projectId);

  if (!project) {
    return res.status(404).json({
      message: "Project not found",
    });
  }
  if (project.createdBy.toString() !== req.user.id) {
    return res.status(403).json({
      message: "Only project owner can review",
    });
  }
  if (project.status !== "completed") {
    return res.status(400).json({
      message: "Project is not completed",
    });
  }
  const existingReview = await Review.findOne({
    project: projectId,
  });

  if (existingReview) {
    return res.status(400).json({
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

  res.status(201).json(review);
};

const getFreelancerReviews = async (req, res) => {
  const reviews = await Review.find({
    freelancer: req.params.id,
  });
  const reviews = await Review.find({
    freelancer: req.params.id,
  }).populate("reviewer", "name");
  let totalRating = 0;

  reviews.forEach((review) => {
    totalRating += review.rating;
  });

  const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;
};

module.exports = {
  createReview,
  getFreelancerReviews,
};
