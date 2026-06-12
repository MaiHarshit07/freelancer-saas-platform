const User = require("../models/user");

const updateProfileImage = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
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

module.exports = {
  updateProfileImage,
};
