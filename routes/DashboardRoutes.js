var express = require("express");
var router = express.Router();

var dashboardController = require("../controllers/DashboardController");
var authMiddleware = require("../middleware/auth");
router.use(authMiddleware.authenticate);
router.use(authMiddleware.filterByBase);
router.get("/metrics", dashboardController.getMetrics);
router.get("/bases", dashboardController.getAllBases);
router.get("/equipment-types", dashboardController.getAllEquipmentTypes);

module.exports = router;