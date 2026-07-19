var mongoose = require("mongoose");

var transferSchema = new mongoose.Schema({
  from_base_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Base",
    required: true
  },
  to_base_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Base",
    required: true
  },
  equipment_type_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "EquipmentType",
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  date: {
    type: String,
    required: true
  },
  notes: {
    type: String,
    default: ""
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
}, {
  timestamps: true
});

var Transfer = mongoose.model("Transfer", transferSchema);

module.exports = Transfer;