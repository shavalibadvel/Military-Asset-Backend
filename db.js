var mongoose = require("mongoose");
const url="mongodb+srv://badvelshavali_db_user:Shavali%230703@shavali-cluster0.3jzuct9.mongodb.net/military_assets?appName=Shavali-Cluster0"
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