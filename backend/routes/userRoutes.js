const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const { uploadPdf, uploadImage } = require("../middleware/uploadMiddleware");
const validateResume = require("../middleware/validateResume");
const {
  updateProfileImage,
  uploadResume,
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
  uploadPdf.single("file"),
  validateResume,
  uploadResume,
);
router.get("/:id", getFreelancerProfile);
module.exports = router;
