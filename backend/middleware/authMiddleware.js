const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  const authorization = req.headers.authorization || "";
  const tokenMatch = authorization.match(/^Bearer\s+(.+)$/i);
  const token = tokenMatch?.[1];

  if (!token) {
    return res.status(401).json({
      message: "No token found",
    });
  }

  try {
    if (!process.env.JWT_SECRET) {
      return res
        .status(500)
        .json({ message: "Authentication is not configured" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({ message: "User not found" });
    }

    return next();
  } catch (error) {
    return res.status(401).json({
      message: "Not authorized",
    });
  }
};

module.exports = protect;
