const validateResume = (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "No file uploaded",
    });
  }

  if (req.file.mimetype !== "application/pdf") {
    return res.status(400).json({
      success: false,
      message: "Only PDF files are allowed",
    });
  }

  next();
};

module.exports = validateResume;
