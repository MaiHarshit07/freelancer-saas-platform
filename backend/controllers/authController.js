const User = require("../models/User");
// got the user from models user.js
const bcrypt = require("bcryptjs"); //used for hashing of passwords
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  const body = req.body || {};
  const { name, email, password, role } = body;

  if (!name || !email || !password) {
    return res.status(400).json({
      message: "Please provide name, email, and password",
    });
  }

  const salt = await bcrypt.genSalt(10); // salt matlab some amount of extra characters added taki for even two same pass we could get different hashed values to hackers ko mushkil hogi

  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role,
  });

  res.status(201).json(user);
};
// this is the function that will run when user hit the Register route

//login controller

const loginUser = async (req, res) => {
  const body = req.body || {};
  const { email, password } = body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Please provide email and password",
    });
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json({
      message: "User Not Found",
    });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(400).json({
      message: "Invalid credentials",
    });
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
    message: "Login Successful",
    token,
  });
};

const getProfile = async (req, res) => {
  const user = await User.findById(req.user.id).select("-password -__v");

  res.json(user);
};

const updateProfile = async (req, res) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  user.name = req.body.name || user.name;

  user.role = req.body.role || user.role;

  const updatedUser = await user.save();

  res.json({
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    role: updatedUser.role,
  });
};

module.exports = {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
};
