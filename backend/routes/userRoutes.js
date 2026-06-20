const express = require("express");
const router = express.Router();

const { updateProfileImage } = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");
const { uploadPdf, uploadImage } = require("../middleware/uploadMiddleware");
const validateResume = require("../middleware/validateResume");
const { uploadResume } = require("../controllers/userController");

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

module.exports = router;
