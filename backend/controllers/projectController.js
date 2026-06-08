const Project = require("../models/Project");

const createProject = async (req, res) => {
  const { title, description, budget, skills } = req.body;

  const project = await Project.create({
    title,
    description,
    budget,
    skills,

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

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  getMyProjects,
};
