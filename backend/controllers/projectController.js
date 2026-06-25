const Project = require("../models/Project");

const createProject = async (req, res) => {
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

  res.status(201).json(project);
};

const getProjects = async (req, res) => {
  const projects = await Project.find().populate(
    "createdBy",
    "name email role",
  );
  // iska matlab look inside createdBy and return only name email and role
  res.json(projects);
};
const getProjectById = async (req, res) => {
  const project = await Project.findById(req.params.id).populate(
    "createdBy",
    "name email role",
  );

  if (!project) {
    return res.status(404).json({
      message: "Project not found",
    });
  }

  res.json(project);
};
const updateProject = async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    return res.status(404).json({
      message: "Project not found",
    });
  }

  if (project.createdBy.toString() !== req.user.id) {
    return res.status(403).json({
      message: "Access denied",
    });
  }

  const updatedProject = await Project.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
    },
  );

  res.json(updatedProject);
};

const deleteProject = async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    return res.status(404).json({
      message: "Project not found",
    });
  }

  if (project.createdBy.toString() !== req.user.id) {
    return res.status(403).json({
      message: "Access denied",
    });
  }

  await project.deleteOne();

  res.json({
    message: "Project deleted successfully",
  });
};
const getMyProjects = async (req, res) => {
  const projects = await Project.find({
    createdBy: req.user.id,
  }).populate("createdBy", "name email role");
  res.json(projects);
};
const completeProject = async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) {
    return res.status(404).json({
      message: "Project Not Found",
    });
  }
  if (project.createdBy.toString() !== req.user.id) {
    return res.status(403).json({
      message: "Only owner can complete project",
    });
  }

  project.status = "completed";

  await project.save();

  res.json(project);
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

      totalProjects,

      openProjects,

      inProgressProjects,

      completedProjects,
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
