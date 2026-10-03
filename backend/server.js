require("dotenv").config();

const express = require("express");
const cors = require("cors");
const http = require("http");

const connectDB = require("./config/db");
const socketAuthMiddleware = require("./middleware/socketAuthMiddleware");

const app = express();
const server = http.createServer(app);

const { Server } = require("socket.io");

const authRoutes = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");
const proposalRoutes = require("./routes/proposalRoutes");
const messageRoutes = require("./routes/messageRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const userRoutes = require("./routes/userRoutes");
const portfolioRoutes = require("./routes/portfolioRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const Project = require("./models/Project");
// ==========================================
// DATABASE
// ==========================================

connectDB();

// ==========================================
// MIDDLEWARE
// ==========================================

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==========================================
// REST API ROUTES
// ==========================================

app.use("/api/auth", authRoutes);

app.use("/api/projects", projectRoutes);

app.use("/api/proposals", proposalRoutes);

app.use("/api/messages", messageRoutes);

app.use("/api/upload", uploadRoutes);

app.use("/api/users", userRoutes);

app.use("/api/portfolio", portfolioRoutes);

app.use("/api/notifications", notificationRoutes);

app.use("/api/reviews", reviewRoutes);

// ==========================================
// SOCKET.IO
// ==========================================

// SOCKET.IO
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.use(socketAuthMiddleware);

io.on("connection", (socket) => {
  console.log(`Socket connected: ${socket.id} | User: ${socket.user.name}`);

  // JOIN PROJECT ROOM
  socket.on("joinProject", async (projectId) => {
    try {
      if (!projectId) return;

      const project = await Project.findById(projectId).select(
        "createdBy assignedFreelancer status",
      );

      if (!project) {
        socket.emit("socketError", {
          message: "Project not found",
        });
        return;
      }

      const userId = socket.user._id.toString();

      const isOwner = project.createdBy.toString() === userId;

      const isAssignedFreelancer =
        project.assignedFreelancer &&
        project.assignedFreelancer.toString() === userId;

      // Only project participants can join
      if (!isOwner && !isAssignedFreelancer) {
        socket.emit("socketError", {
          message: "You are not authorized to access this project chat",
        });
        return;
      }

      // Chat becomes available only after proposal acceptance
      if (project.status !== "in-progress") {
        socket.emit("socketError", {
          message: "Project chat is not available yet",
        });
        return;
      }

      socket.join(`project:${projectId}`);

      console.log(`${socket.user.name} joined project:${projectId}`);
    } catch (error) {
      console.error("joinProject error:", error.message);

      socket.emit("socketError", {
        message: "Unable to join project chat",
      });
    }
  });

  // LEAVE PROJECT ROOM
  socket.on("leaveProject", (projectId) => {
    if (!projectId) return;

    socket.leave(`project:${projectId}`);

    console.log(`${socket.user.name} left project:${projectId}`);
  });

  // REALTIME MESSAGE
  socket.on("sendMessage", async ({ message, projectId }) => {
    try {
      if (!message || !projectId) return;

      const project = await Project.findById(projectId).select(
        "createdBy assignedFreelancer status",
      );

      if (!project) return;

      const userId = socket.user._id.toString();

      const isOwner = project.createdBy.toString() === userId;

      const isAssignedFreelancer =
        project.assignedFreelancer &&
        project.assignedFreelancer.toString() === userId;

      // Sender must belong to project
      if (!isOwner && !isAssignedFreelancer) {
        socket.emit("socketError", {
          message: "You are not authorized to send messages here",
        });
        return;
      }

      // Project must be active
      if (project.status !== "in-progress") {
        socket.emit("socketError", {
          message: "Messaging is not available for this project",
        });
        return;
      }

      // Make sure sender is actually in the room
      const room = io.sockets.adapter.rooms.get(`project:${projectId}`);

      if (!room || !room.has(socket.id)) {
        socket.emit("socketError", {
          message: "You are not connected to this project chat",
        });
        return;
      }

      // Send only to other authorized participants
      socket.to(`project:${projectId}`).emit("receiveMessage", message);
    } catch (error) {
      console.error("sendMessage socket error:", error.message);
    }
  });

  socket.on("disconnect", () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

// ==========================================
// HEALTH CHECK
// ==========================================

app.get("/", (req, res) => {
  res.send("API is running...");
});

// ==========================================
// START SERVER
// ==========================================

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`server is running at http://localhost:${PORT}`);

  console.log(`Socket.IO is running on port ${PORT}`);
});
