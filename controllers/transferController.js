var Transfer = require("../models/Transfer");
var getAllTransfers = async function (req, res) {
  try {
    var startDate = req.query.startDate;
    var endDate = req.query.endDate;
    var baseId = req.query.baseId;
    var equipmentTypeId = req.query.equipmentTypeId;

    var effectiveBaseId = req.userBaseId || baseId;
    var filter = {};

    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = startDate;
      if (endDate) filter.date.$lte = endDate;
    }

    if (effectiveBaseId) {
      filter.$or = [
        { from_base_id: effectiveBaseId },
        { to_base_id: effectiveBaseId }
      ];
    }

    if (equipmentTypeId) {
      filter.equipment_type_id = equipmentTypeId;
    }

    var transfers = await Transfer.find(filter)
      .populate("from_base_id", "name")
      .populate("to_base_id", "name")
      .populate("equipment_type_id", "name category")
      .populate("created_by", "full_name")
      .sort({ date: -1, createdAt: -1 });

    res.json(transfers);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

var createTransfer = async function (req, res) {
  try {
    var from_base_id = req.body.from_base_id;
    var to_base_id = req.body.to_base_id;
    var equipment_type_id = req.body.equipment_type_id;
    var quantity = req.body.quantity;
    var date = req.body.date;
    var notes = req.body.notes;
    if (!from_base_id || !to_base_id || !equipment_type_id || !quantity || !date) {
      return res.status(400).json({
        error: "from_base_id, to_base_id, equipment_type_id, quantity, and date are required."
      });
    }
    if (from_base_id === to_base_id) {
      return res.status(400).json({ error: "Cannot transfer to the same base." });
    }

    if (quantity <= 0) {
      return res.status(400).json({ error: "Quantity must be greater than 0." });
    }

    var newTransfer = new Transfer({
      from_base_id: from_base_id,
      to_base_id: to_base_id,
      equipment_type_id: equipment_type_id,
      quantity: quantity,
      date: date,
      notes: notes || "",
      created_by: req.user.id
    });

    var savedTransfer = await newTransfer.save();

    res.status(201).json({
      message: "Transfer recorded successfully",
      id: savedTransfer._id
    });

  } catch (error) {
    res.status(500).json({ error: "Failed to record transfer: " + error.message });
  }
};

module.exports = {
  getAllTransfers: getAllTransfers,
  createTransfer: createTransfer
};