const { get } = require("mongoose");
const Portfolio = require("../models/Portfolio");
const cloudinary = require("../config/cloudinary");

const createPortfolio = async (req, res) => {
  try {
    const { title, description, projectLink } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Portfolio image required",
      });
    }
    console.log(req.file);
    const portfolio = await Portfolio.create({
      freelancer: req.user.id,

      title,
      description,
      projectLink,

      image: {
        url: req.file.secure_url,
        publicId: req.file.public_id,
      },
    });
    // we have used secure_url because the app request has the secure_url for the cloudinary
    res.status(201).json({
      success: true,
      data: portfolio,
    });
  } catch (error) {
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

    portfolio.title = req.body.title || portfolio.title;

    portfolio.description = req.body.description || portfolio.description;

    portfolio.projectLink = req.body.projectLink || portfolio.projectLink;

    if (req.file) {
      if (portfolio.image.publicId) {
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
      data: portfolio,
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
