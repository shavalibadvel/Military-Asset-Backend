var express = require("express");
var router = express.Router();

var purchaseController = require("../controllers/PurchaseController");
var authMiddleware = require("../middleware/auth");
router.use(authMiddleware.authenticate);
router.use(authMiddleware.filterByBase);
router.get("/", purchaseController.getAllPurchases);
router.post(
  "/",
  authMiddleware.authorize(["Admin", "Logistics Officer"]),
  purchaseController.createPurchase
);

module.exports = router;