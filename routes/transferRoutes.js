var express = require("express");
var router = express.Router();

var transferController = require("../controllers/transferController");
var authMiddleware = require("../middleware/auth");
router.use(authMiddleware.authenticate);
router.use(authMiddleware.filterByBase);

router.get("/", transferController.getAllTransfers);
router.post(
  "/",
  authMiddleware.authorize(["Admin", "Logistics Officer"]),
  transferController.createTransfer
);

module.exports = router;