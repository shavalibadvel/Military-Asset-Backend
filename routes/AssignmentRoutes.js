var express = require("express");
var router = express.Router();

var assignmentController = require("../controllers/AssignmentController");
var authMiddleware = require("../middleware/auth");
router.use(authMiddleware.authenticate);
router.use(authMiddleware.filterByBase);
router.get("/", assignmentController.getAllAssignments);
router.post(
  "/",
  authMiddleware.authorize(["Admin", "Base Commander"]),
  assignmentController.createAssignment
);

router.get("/expenditures", assignmentController.getAllExpenditures);
router.post(
  "/expenditures",
  authMiddleware.authorize(["Admin", "Base Commander"]),
  assignmentController.createExpenditure
);

module.exports = router;