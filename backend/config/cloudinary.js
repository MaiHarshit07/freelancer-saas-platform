require("dotenv").config();

const cloudinary = require("cloudinary");

const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY || process.env.CLOUDINARY_KEY;
const apiSecret =
  process.env.CLOUDINARY_API_SECRET ||
  process.env.CLOUDINARY_API_SECR ||
  process.env.CLOUDINARY_SECRET;

cloudinary.v2.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
});

module.exports = cloudinary;
