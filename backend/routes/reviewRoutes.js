const {
  createReview,
  getFreelancerReviews,
} = require("../controllers/reviewController");
router.get("/freelancer/:id", getFreelancerReviews);
