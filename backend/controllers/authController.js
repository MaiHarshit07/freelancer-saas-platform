const User = require("../models/User");
// got the user from models user.js
const bcrypt = require("bcryptjs"); //used for hashing of passwords

const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

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
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!User) {
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

  console.log(" working");
  res.json({
    message: "Login Successful",
  });
};

module.exports = {
  registerUser,
  loginUser,
};
