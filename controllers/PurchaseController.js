var Purchase = require("../models/Purchase");

var getAllPurchases = async function (req, res) {
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
    var purchases = await Purchase.find(filter)
      .populate("base_id", "name")                      
      .populate("equipment_type_id", "name category")   
      .populate("created_by", "full_name")             
      .sort({ date: -1, createdAt: -1 });              

    res.json(purchases);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

var createPurchase = async function (req, res) {
  try {
    var base_id = req.body.base_id;
    var equipment_type_id = req.body.equipment_type_id;
    var quantity = req.body.quantity;
    var date = req.body.date;
    var notes = req.body.notes;
    if (!base_id || !equipment_type_id || !quantity || !date) {
      return res.status(400).json({
        error: "base_id, equipment_type_id, quantity, and date are required."
      });
    }
    if (quantity <= 0) {
      return res.status(400).json({ error: "Quantity must be greater than 0." });
    }

    var newPurchase = new Purchase({
      base_id: base_id,
      equipment_type_id: equipment_type_id,
      quantity: quantity,
      date: date,
      notes: notes || "",
      created_by: req.user.id 
    });
    var savedPurchase = await newPurchase.save();

    res.status(201).json({
      message: "Purchase recorded successfully",
      id: savedPurchase._id
    });

  } catch (error) {
    res.status(500).json({ error: "Failed to record purchase: " + error.message });
  }
};

module.exports = {
  getAllPurchases: getAllPurchases,
  createPurchase: createPurchase
};