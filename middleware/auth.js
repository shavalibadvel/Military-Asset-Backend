var jwt = require("jsonwebtoken");

var JWT_SECRET = "military-asset-secret-key-change-in-production";

var authenticate = function (req, res, next) {
  var header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided. Please log in." });
  }
  var token = header.split(" ")[1];

  try {
    var decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid or expired token." });
  }
};
//
var authorize = function (allowedRoles) {
  return function (req, res, next) {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated." });
    }
    var userRole = req.user.role;
    var isAllowed = allowedRoles.indexOf(userRole) !== -1;

    if (!isAllowed) {
      return res.status(403).json({
        error: "Access denied. You need one of these roles: " + allowedRoles.join(", ")
      });
    }

    next();
  };
};


var filterByBase = function (req, res, next) {
  if (req.user.role === "Base Commander") {
    req.userBaseId = req.user.base_id;
  } else {
    req.userBaseId = null;
  }
  next();
};
module.exports = {
  authenticate: authenticate,
  authorize: authorize,
  filterByBase: filterByBase,
  JWT_SECRET: JWT_SECRET
};