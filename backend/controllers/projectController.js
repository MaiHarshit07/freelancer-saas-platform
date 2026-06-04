const Project = require("../models/project");

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

module.exports = {
  createProject,
  getProjects,
  getProjectById,
};
