const Portfolio = require("../models/Portfolio");
const cloudinary = require("../config/cloudinary");

const parseTechnologies = (value) => {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
};

const createPortfolio = async (req, res) => {
  try {
    const { title, description, projectLink, githubUrl } = req.body;

    if (!title?.trim() || !description?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Title and description are required",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Portfolio image is required",
      });
    }

    const portfolio = await Portfolio.create({
      freelancer: req.user.id,
      title: title.trim(),
      description: description.trim(),
      projectLink: projectLink || "",
      githubUrl: githubUrl || "",
      technologies: parseTechnologies(req.body.technologies),
      image: {
        url: req.file.secure_url,
        publicId: req.file.public_id,
      },
    });

    res.status(201).json({
      success: true,
      message: "Portfolio created successfully",
      portfolio,
    });
  } catch (error) {
    console.error("Create portfolio error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getFreelancerPortfolio = async (req, res) => {
  try {
    const portfolios = await Portfolio.find({
      freelancer: req.params.freelancerId,
    });

    res.status(200).json({
      success: true,
      message: "Portfolio fetched successfully",
      count: portfolios.length,
      data: portfolios,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updatePortfolio = async (req, res) => {
  try {
    const portfolio = await Portfolio.findById(req.params.id);

    if (!portfolio) {
      return res.status(404).json({
        success: false,
        message: "Portfolio not found",
      });
    }

    if (portfolio.freelancer.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    if (req.body.title) {
      portfolio.title = req.body.title.trim();
    }

    if (req.body.description) {
      portfolio.description = req.body.description.trim();
    }

    if (req.body.projectLink !== undefined) {
      portfolio.projectLink = req.body.projectLink || "";
    }

    if (req.body.githubUrl !== undefined) {
      portfolio.githubUrl = req.body.githubUrl || "";
    }

    if (req.body.technologies !== undefined) {
      portfolio.technologies = parseTechnologies(req.body.technologies);
    }

    if (req.file) {
      if (portfolio.image && portfolio.image.publicId) {
        await cloudinary.uploader.destroy(portfolio.image.publicId);
      }

      portfolio.image = {
        url: req.file.secure_url,
        publicId: req.file.public_id,
      };
    }

    await portfolio.save();

    res.status(200).json({
      success: true,
      message: "Portfolio updated successfully",
      portfolio,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deletePortfolio = async (req, res) => {
  try {
    const portfolio = await Portfolio.findById(req.params.id);

    if (!portfolio) {
      return res.status(404).json({
        success: false,
        message: "Portfolio not found",
      });
    }

    if (portfolio.freelancer.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    if (portfolio.image.publicId) {
      await cloudinary.uploader.destroy(portfolio.image.publicId);
    }

    await portfolio.deleteOne();

    res.status(200).json({
      success: true,
      message: "Portfolio deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createPortfolio,
  getFreelancerPortfolio,
  updatePortfolio,
  deletePortfolio,
};
