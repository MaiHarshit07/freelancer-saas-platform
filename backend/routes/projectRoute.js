const express = require("express");
const router = express.Router();

const {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  getMyProjects,
} = require("../controllers/projectController");

const protect = require("../middleware/authMiddleware");
router.post("/", protect, createProject);
router.get("/", getProjects);
router.get("/my-projects", protect, getMyProjects);
router.get("/:id", getProjectById);
router.put("/:id", protect, updateProject);
router.delete("/:id", protect, deleteProject);

module.exports = router;
