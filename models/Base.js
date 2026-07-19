var mongoose = require("mongoose");

var baseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  location: {
    type: String,
    required: true
  }
});

var Base = mongoose.model("Base", baseSchema);

module.exports = Base;