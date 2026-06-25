const express = require("express");
const router = express.Router();

const {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  getMyProjects,
  completeProject,
  getClientDashboard,
} = require("../controllers/projectController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");
const { uploadAny } = require("../middleware/uploadMiddleware");

router.post(
  "/",
  protect,
  authorizeRoles("client"),
  uploadAny.array("files", 5),
  createProject,
);
router.get("/", getProjects);
router.get("/my-projects", protect, getMyProjects);
router.get(
  "/dashboard/client",
  protect,
  authorizeRoles("client"),
  getClientDashboard,
);
router.get("/:id", getProjectById);
router.put("/:id", protect, updateProject);
router.delete("/:id", protect, deleteProject);
router.put("/:id/complete", protect, authorizeRoles("client"), completeProject);

module.exports = router;
