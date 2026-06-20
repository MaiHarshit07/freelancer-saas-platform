const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const { uploadAny } = require("../middleware/uploadMiddleware");
const { uploadFile } = require("../controllers/uploadController");

router.post("/", authMiddleware, uploadAny.single("file"), uploadFile);

module.exports = router;
