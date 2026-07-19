var mongoose = require("mongoose");

var assignmentSchema = new mongoose.Schema({
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
  personnel_name: {
    type: String,
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
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
}, {
  timestamps: true
});

var Assignment = mongoose.model("Assignment", assignmentSchema);

module.exports = Assignment;