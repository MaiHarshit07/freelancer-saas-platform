const mongoose = require("mongoose");

const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const connectDB = async () => {
  try {
    console.log("Trying to connect DB...");

    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`MongoDB Connected: ${conn.connection.host}`);

    console.log(`Database Name: ${conn.connection.name}`);
  } catch (error) {
    console.log(error);

    process.exit(1);
  }
};

module.exports = connectDB;
