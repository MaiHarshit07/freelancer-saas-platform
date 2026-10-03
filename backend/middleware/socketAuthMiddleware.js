const jwt = require("jsonwebtoken");
const User = require("../models/User");

const socketAuthMiddleware = async (socket, next) => {
  try {
    const token = socket.handshake.auth?.token;

    if (!token) {
      return next(new Error("Authentication token required"));
    }

    if (!process.env.JWT_SECRET) {
      return next(new Error("JWT_SECRET is not configured"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded?.id) {
      return next(new Error("Invalid authentication token"));
    }

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return next(new Error("User not found"));
    }

    socket.user = user;

    next();
  } catch (error) {
    next(new Error("Socket authentication failed"));
  }
};

module.exports = socketAuthMiddleware;
