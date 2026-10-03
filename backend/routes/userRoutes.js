const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");
const { uploadPdf, uploadImage } = require("../middleware/uploadMiddleware");
const validateResume = require("../middleware/validateResume");
const {
  updateProfileImage,
  uploadResume,
  deleteResume,
  getFreelancerProfile,
} = require("../controllers/userController");

router.post(
  "/profile-image",
  authMiddleware,
  uploadImage.single("file"),
  updateProfileImage,
);
router.post(
  "/resume",
  authMiddleware,
  authorizeRoles("freelancer"),
  uploadPdf.single("file"),
  validateResume,
  uploadResume,
);
router.delete(
  "/resume",
  authMiddleware,
  authorizeRoles("freelancer"),
  deleteResume,
);
router.get("/:id", getFreelancerProfile);
module.exports = router;
