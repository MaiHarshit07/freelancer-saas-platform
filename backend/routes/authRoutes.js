const express = require("express");

const router = express.Router();
const authorizeRoles = require("../middleware/roleMiddleware");

const {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
} = require("../controllers/authController");

const protect = require("../middleware/authMiddleware");

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);
router.get("/client-only", protect, authorizeRoles("client"), (req, res) => {
  res.json({
    message: "Welcome Client",
  });
});

module.exports = router;
