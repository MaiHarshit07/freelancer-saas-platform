const User = require("../models/User");
const cloudinary = require("../config/cloudinary");

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
module.exports = {
  updateProfileImage,
  uploadResume,
};
