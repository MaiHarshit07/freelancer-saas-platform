const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const {
  createReview,
  getGivenReviews,
  getFreelancerReviews,
} = require("../controllers/reviewController");

router.post("/", protect, authorizeRoles("client"), createReview);
router.get("/given", protect, authorizeRoles("client"), getGivenReviews);

router.get("/freelancer/:id", getFreelancerReviews);

module.exports = router;
