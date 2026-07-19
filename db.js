var mongoose = require("mongoose");
var MONGO_URL = process.env.MONGO_URL || "mongodb://localhost:27017/military-assets";

var connectDB = async function () {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("Connected to MongoDB successfully");
  } catch (error) {
    console.log("MongoDB connection failed:", error.message);
    process.exit(1); 
  }
};

module.exports = connectDB;