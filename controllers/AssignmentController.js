var Assignment = require("../models/Assignment");
var Expenditure = require("../models/Expenditure");
var getAllAssignments = async function (req, res) {
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
      filter.base_id = effectiveBaseId;
    }

    if (equipmentTypeId) {
      filter.equipment_type_id = equipmentTypeId;
    }

    var assignments = await Assignment.find(filter)
      .populate("base_id", "name")
      .populate("equipment_type_id", "name category")
      .populate("created_by", "full_name")
      .sort({ date: -1, createdAt: -1 });

    res.json(assignments);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
var createAssignment = async function (req, res) {
  try {
    var base_id = req.body.base_id;
    var equipment_type_id = req.body.equipment_type_id;
    var personnel_name = req.body.personnel_name;
    var quantity = req.body.quantity;
    var date = req.body.date;
if (!base_id || !equipment_type_id || !personnel_name || !quantity || !date) {
      return res.status(400).json({
        error: "base_id, equipment_type_id, personnel_name, quantity, and date are required."
      });
    }

    if (quantity <= 0) {
      return res.status(400).json({ error: "Quantity must be greater than 0." });
    }

    var newAssignment = new Assignment({
      base_id: base_id,
      equipment_type_id: equipment_type_id,
      personnel_name: personnel_name,
      quantity: quantity,
      date: date,
      created_by: req.user.id
    });

    var savedAssignment = await newAssignment.save();

    res.status(201).json({
      message: "Assignment recorded successfully",
      id: savedAssignment._id
    });

  } catch (error) {
    res.status(500).json({ error: "Failed to record assignment: " + error.message });
  }
};
var getAllExpenditures = async function (req, res) {
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
      filter.base_id = effectiveBaseId;
    }

    if (equipmentTypeId) {
      filter.equipment_type_id = equipmentTypeId;
    }

    var expenditures = await Expenditure.find(filter)
      .populate("base_id", "name")
      .populate("equipment_type_id", "name category")
      .populate("created_by", "full_name")
      .sort({ date: -1, createdAt: -1 });

    res.json(expenditures);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
var createExpenditure = async function (req, res) {
  try {
    var base_id = req.body.base_id;
    var equipment_type_id = req.body.equipment_type_id;
    var quantity = req.body.quantity;
    var reason = req.body.reason;
    var date = req.body.date;

    if (!base_id || !equipment_type_id || !quantity || !reason || !date) {
      return res.status(400).json({
        error: "base_id, equipment_type_id, quantity, reason, and date are required."
      });
    }

    if (quantity <= 0) {
      return res.status(400).json({ error: "Quantity must be greater than 0." });
    }

    var newExpenditure = new Expenditure({
      base_id: base_id,
      equipment_type_id: equipment_type_id,
      quantity: quantity,
      reason: reason,
      date: date,
      created_by: req.user.id
    });

    var savedExpenditure = await newExpenditure.save();

    res.status(201).json({
      message: "Expenditure recorded successfully",
      id: savedExpenditure._id
    });

  } catch (error) {
    res.status(500).json({ error: "Failed to record expenditure: " + error.message });
  }
};

module.exports = {
  getAllAssignments: getAllAssignments,
  createAssignment: createAssignment,
  getAllExpenditures: getAllExpenditures,
  createExpenditure: createExpenditure
};