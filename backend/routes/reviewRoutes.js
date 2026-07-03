const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  createReview,
  getFreelancerReviews,
} = require("../controllers/reviewController");

router.post("/", protect, createReview);

router.get("/freelancer/:id", getFreelancerReviews);

module.exports = router;
