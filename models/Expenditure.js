
var mongoose = require("mongoose");

var expenditureSchema = new mongoose.Schema({
  base_id: {
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
  reason: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
}, {
  timestamps: true
});

var Expenditure = mongoose.model("Expenditure", expenditureSchema);

module.exports = Expenditure;