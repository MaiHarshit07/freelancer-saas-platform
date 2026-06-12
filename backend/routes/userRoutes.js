const express = require("express");
const router = express.Router();

const { updateProfileImage } = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

router.post(
  "/profile-image",
  authMiddleware,
  upload.single("file"),
  updateProfileImage,
);

module.exports = router;
