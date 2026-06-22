const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const { uploadImage } = require("../middleware/uploadMiddleware");

const {
  createPortfolio,
  getFreelancerPortfolio,
  updatePortfolio,
} = require("../controllers/portfolioController");

router.post(
  "/",
  authMiddleware,
  authorizeRoles("freelancer"),
  uploadImage.single("file"),
  createPortfolio,
);
router.get("/:freelancerId", getFreelancerPortfolio);

router.put(
  "/:id",
  authMiddleware,
  authorizeRoles("freelancer"),
  uploadImage.single("file"),
  updatePortfolio,
);
module.exports = router;
