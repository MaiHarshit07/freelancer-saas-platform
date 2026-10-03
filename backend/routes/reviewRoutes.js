const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const {
  createReview,
  getFreelancerReviews,
} = require("../controllers/reviewController");

router.post("/", protect, authorizeRoles("client"), createReview);

router.get("/freelancer/:id", getFreelancerReviews);

module.exports = router;
