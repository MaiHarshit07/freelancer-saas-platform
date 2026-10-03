const User = require("../models/User");
// got the user from models user.js
const bcrypt = require("bcryptjs"); //used for hashing of passwords
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  try {
    const body = req.body || {};
    const { name, email, password, role } = body;

    if (!name?.trim() || !email?.trim() || !password) {
      return res.status(400).json({
        message: "Please provide name, email, and password",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedRole = role?.toLowerCase();

    if (normalizedRole && !["client", "freelancer"].includes(normalizedRole)) {
      return res.status(400).json({
        message: "Role must be client or freelancer",
      });
    }

    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(409).json({ message: "Email is already registered" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: normalizedRole,
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
// this is the function that will run when user hit the Register route

//login controller

const loginUser = async (req, res) => {
  try {
    const body = req.body || {};
    const { email, password } = body;

    if (!email?.trim() || !password) {
      return res.status(400).json({
        message: "Please provide email and password",
      });
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    if (!process.env.JWT_SECRET) {
      return res
        .status(500)
        .json({ message: "Authentication is not configured" });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getProfile = async (req, res) => {
  const user = await User.findById(req.user.id).select("-password -__v");

  res.json({
    success: true,
    user,
  });
};

const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const name = req.body.name?.trim();
    const bio = req.body.bio ?? user.bio ?? "";
    const rawSkills = req.body.skills;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Name is required",
      });
    }

    const skills = Array.isArray(rawSkills)
      ? rawSkills.map((skill) => String(skill).trim()).filter(Boolean)
      : typeof rawSkills === "string"
        ? rawSkills
            .split(",")
            .map((skill) => skill.trim())
            .filter(Boolean)
        : user.skills || [];

    user.name = name;
    user.bio = String(bio).trim();
    user.skills = skills;

    const updatedUser = await user.save();

    res.json({
      success: true,
      message: "Profile updated successfully",
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        bio: updatedUser.bio,
        skills: updatedUser.skills,
        profileImage: updatedUser.profileImage,
        resume: updatedUser.resume,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body || {};

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message:
          "Current password, new password, and confirm password are required",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "New password and confirm password do not match",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 6 characters long",
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteAccount = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    await User.findByIdAndDelete(req.user.id);

    res.json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  changePassword,
  deleteAccount,
};
