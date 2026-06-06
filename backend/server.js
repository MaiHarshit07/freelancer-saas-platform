require("dotenv").config();

const express = require("express");
const connectDB = require("./config/db");
const app = express();

const authRoutes = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoute");
const proposalRoutes = require("./routes/proposalRoutes");
// db connections
connectDB();

// app.get("/test", (req, res) => {
//   res.send("Test route working");
// });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/auth", authRoutes);
// ------->   “All routes inside authRoutes belong to authentication module.” sare routes k aage /api/auth aajayega authRoutes ke

app.use("/api/projects", projectRoutes);
app.use("/api/proposals", proposalRoutes);

// ============================================= //
app.get("/", (req, res) => {
  res.send("API is running...");
});
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`server is running at http://localhost:${PORT}`);
});
