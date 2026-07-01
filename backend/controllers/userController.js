const User = require("../models/User");
const cloudinary = require("../config/cloudinary");
const Portfolio = require("../models/Portfolio");
const Review = require("../models/Review");

// ===========================  //

const updateProfileImage = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.profileImage && user.profileImage.publicId) {
      await cloudinary.uploader.destroy(user.profileImage.publicId);
    }
    user.profileImage = {
      url: req.file.path,
      publicId: req.file.filename,
    };

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile image updated successfully",
      profileImage: user.profileImage,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.resume && user.resume.publicId) {
      await cloudinary.uploader.destroy(user.resume.publicId, {
        resource_type: "raw",
      });
    }

    user.resume = {
      url: req.file.path,
      publicId: req.file.filename,
      originalName: req.file.originalname,
    };

    await user.save();

    res.status(200).json({
      success: true,
      message: "Resume uploaded successfully",
      data: user.resume,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const getFreelancerProfile = async (req, res) => {
  try {
    const freelancer = await User.findById(req.params.id).select("-password");

    if (!freelancer) {
      return res.status(404).json({
        success: false,
        message: "Freelancer not found",
      });
    }

    const portfolio = await Portfolio.find({
      freelancer: freelancer._id,
    });

    const reviews = await Review.find({
      reviewee: freelancer._id,
    }).populate("reviewer", "name");

    const averageRating =
      reviews.length > 0
        ? reviews.reduce((sum, review) => sum + review.rating, 0) /
          reviews.length
        : 0;

    res.status(200).json({
      success: true,
      freelancer,
      portfolio,
      reviews,
      averageRating,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
module.exports = {
  updateProfileImage,
  uploadResume,
  getFreelancerProfile,
};
