var mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  full_name: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true,
    enum: ["Admin", "Base Commander", "Logistics Officer"]
  },
  base_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Base",     
    default: null     
  }
});

var User = mongoose.model("User", userSchema);

module.exports = User;