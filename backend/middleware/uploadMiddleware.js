const multer = require("multer");
const CloudinaryStorage = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");
const { pdfOnly, imageOnly } = require("./fileFilter");
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "freelancer-saas",
    allowed_formats: ["jpg", "jpeg", "png", "pdf"],
  },
});

const uploadAny = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

const uploadPdf = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: pdfOnly,
});

const uploadImage = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: imageOnly,
});

module.exports = {
  uploadAny,
  uploadPdf,
  uploadImage,
};
