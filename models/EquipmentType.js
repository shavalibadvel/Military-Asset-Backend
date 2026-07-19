var mongoose = require("mongoose");

var equipmentTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ["Weapons", "Vehicles", "Ammunition", "Equipment"]
  }
});

var EquipmentType = mongoose.model("EquipmentType", equipmentTypeSchema);

module.exports = EquipmentType;