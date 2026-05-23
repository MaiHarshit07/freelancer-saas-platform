const mongoose = require("mongoose");
// ================
const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);
// ================
// in production these two lines is not included as they  have specified better dns servers for this purpose in google or aws

const connectDB = async () => {
  try {
    console.log("Trying to connect DB...");

    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

module.exports = connectDB;
