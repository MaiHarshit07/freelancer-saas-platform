const express = require("express");
const router = express.Router();

const { updateProfileImage } = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const validateResume = require("../middleware/validateResume");
const { uploadResume } = require("../controllers/userController");

router.post(
  "/profile-image",
  authMiddleware,
  upload.single("file"),
  updateProfileImage,
);
router.post(
  "/resume",
  authMiddleware,
  upload.single("file"),
  validateResume,
  uploadResume,
);

module.exports = router;
