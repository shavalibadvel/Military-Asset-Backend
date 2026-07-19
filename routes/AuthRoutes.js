var express = require("express");
var router = express.Router();

var authController = require("../controllers/authController");
var authMiddleware = require("../middleware/auth");
router.post("/login", authController.login);
router.get("/me", authMiddleware.authenticate, authController.getMe);

module.exports = router;