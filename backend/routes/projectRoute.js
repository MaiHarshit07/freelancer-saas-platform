const express = require("express");
const router = express.Router();
const {
  createProject,
  getProjects,
  getProjectById,
} = require("../controllers/projectController");
const protect = require("../middleware/authMiddleware");
router.post("/", protect, createProject);
router.get("/", getProjects);
router.get("/:id", getProjectById);

module.exports = router;
