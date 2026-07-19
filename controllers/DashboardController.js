var Purchase = require("../models/Purchase");
var Transfer = require("../models/Transfer");
var Assignment = require("../models/Assignment");
var Expenditure = require("../models/Expenditure");
var Base = require("../models/Base");
var EquipmentType = require("../models/EquipmentType");

var sumQuantity = async function (Model, filter) {
  var result = await Model.aggregate([
    { $match: filter },                                   
    { $group: { _id: null, total: { $sum: "$quantity" } } } 
  ]);

  if (result.length > 0) {
    return result[0].total;
  } else {
    return 0;
  }
};

var getMetrics = async function (req, res) {
  try {
    var startDate = req.query.startDate;
    var endDate = req.query.endDate;
    var baseId = req.query.baseId;
    var equipmentTypeId = req.query.equipmentTypeId;
    var effectiveBaseId = req.userBaseId || baseId;

    var periodFilter = {};

    if (startDate || endDate) {
      periodFilter.date = {};
      if (startDate) periodFilter.date.$gte = startDate; 
      if (endDate) periodFilter.date.$lte = endDate;      
    }

    if (effectiveBaseId) {
      periodFilter.base_id = effectiveBaseId;
    }

    if (equipmentTypeId) {
      periodFilter.equipment_type_id = equipmentTypeId;
    }
    var openingBalance = 0;

    if (startDate) {
      var beforeFilter = { date: { $lt: startDate } };
      if (effectiveBaseId) beforeFilter.base_id = effectiveBaseId;
      if (equipmentTypeId) beforeFilter.equipment_type_id = equipmentTypeId;
      var transferInBefore = { date: { $lt: startDate } };
      if (effectiveBaseId) transferInBefore.to_base_id = effectiveBaseId;
      if (equipmentTypeId) transferInBefore.equipment_type_id = equipmentTypeId;

      var transferOutBefore = { date: { $lt: startDate } };
      if (effectiveBaseId) transferOutBefore.from_base_id = effectiveBaseId;
      if (equipmentTypeId) transferOutBefore.equipment_type_id = equipmentTypeId;

      var purchasesBefore = await sumQuantity(Purchase, beforeFilter);
      var transInBefore = await sumQuantity(Transfer, transferInBefore);
      var transOutBefore = await sumQuantity(Transfer, transferOutBefore);
      var expendedBefore = await sumQuantity(Expenditure, beforeFilter);
      var assignedBefore = await sumQuantity(Assignment, beforeFilter);

      openingBalance = purchasesBefore + transInBefore - transOutBefore - expendedBefore - assignedBefore;
    }

    var totalPurchases = await sumQuantity(Purchase, periodFilter);

    var transferInFilter = {};
    if (startDate || endDate) {
      transferInFilter.date = {};
      if (startDate) transferInFilter.date.$gte = startDate;
      if (endDate) transferInFilter.date.$lte = endDate;
    }
    if (effectiveBaseId) transferInFilter.to_base_id = effectiveBaseId;
    if (equipmentTypeId) transferInFilter.equipment_type_id = equipmentTypeId;

    var transferOutFilter = {};
    if (startDate || endDate) {
      transferOutFilter.date = {};
      if (startDate) transferOutFilter.date.$gte = startDate;
      if (endDate) transferOutFilter.date.$lte = endDate;
    }
    if (effectiveBaseId) transferOutFilter.from_base_id = effectiveBaseId;
    if (equipmentTypeId) transferOutFilter.equipment_type_id = equipmentTypeId;

    var totalTransfersIn = await sumQuantity(Transfer, transferInFilter);
    var totalTransfersOut = await sumQuantity(Transfer, transferOutFilter);
    var totalAssigned = await sumQuantity(Assignment, periodFilter);
    var totalExpended = await sumQuantity(Expenditure, periodFilter);
    var netMovement = totalPurchases + totalTransfersIn - totalTransfersOut;
    var closingBalance = openingBalance + netMovement - totalAssigned - totalExpended;
    res.json({
      openingBalance: openingBalance,
      closingBalance: closingBalance,
      netMovement: netMovement,
      purchases: totalPurchases,
      transfersIn: totalTransfersIn,
      transfersOut: totalTransfersOut,
      assigned: totalAssigned,
      expended: totalExpended
    });

  } catch (error) {
    res.status(500).json({ error: "Failed to load metrics: " + error.message });
  }
};


var getAllBases = async function (req, res) {
  try {
    var bases = await Base.find().sort("name");
    res.json(bases);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

var getAllEquipmentTypes = async function (req, res) {
  try {
    var types = await EquipmentType.find().sort("category name");
    res.json(types);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getMetrics: getMetrics,
  getAllBases: getAllBases,
  getAllEquipmentTypes: getAllEquipmentTypes
};