const Project = require("../models/Project");

const createProject = async (req, res) => {
  try {
    const { title, description, budget, skills } = req.body;

    let attachments = [];

    if (req.files && req.files.length > 0) {
      attachments = req.files.map((file) => ({
        url: file.secure_url,
        publicId: file.public_id,
        originalName: file.originalname,
      }));
    }

    const project = await Project.create({
      title,
      description,
      budget,
      skills,
      attachments,
      createdBy: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: "Project created successfully",
      project,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getProjects = async (req, res) => {
  try {
    const projects = await Project.find().populate(
      "createdBy",
      "name email role",
    );

    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate(
      "createdBy",
      "name email role",
    );

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    res.status(200).json({
      success: true,
      project,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    if (project.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
    );

    res.status(200).json({
      success: true,
      message: "Project updated successfully",
      project: updatedProject,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    if (project.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    await project.deleteOne();

    res.status(200).json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getMyProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      createdBy: req.user.id,
    }).populate("createdBy", "name email role");

    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const completeProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    if (project.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Only owner can complete project",
      });
    }

    project.status = "completed";

    await project.save();

    res.status(200).json({
      success: true,
      message: "Project marked as completed",
      project,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getClientDashboard = async (req, res) => {
  try {
    const projects = await Project.find({
      createdBy: req.user.id,
    });

    const totalProjects = projects.length;

    const openProjects = projects.filter(
      (project) => project.status === "open",
    ).length;

    const inProgressProjects = projects.filter(
      (project) => project.status === "in-progress",
    ).length;

    const completedProjects = projects.filter(
      (project) => project.status === "completed",
    ).length;

    res.status(200).json({
      success: true,
      dashboard: {
        totalProjects,
        openProjects,
        inProgressProjects,
        completedProjects,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  getMyProjects,
  completeProject,
  getClientDashboard,
};
