var AuditLog = require("../models/Auditlog");

var apiLogger = function (req, res, next) {
  var method = req.method;

  if (method === "POST" || method === "PUT" || method === "DELETE") {
    res.on("finish", async function () {
      try {
        var logEntry = new AuditLog({
          user_id: req.user ? req.user.id : null,
          username: req.user ? req.user.username : "anonymous",
          action: method + " " + req.originalUrl,
          details: JSON.stringify(req.body),
          ip_address: req.ip
        });

        await logEntry.save();
      } catch (error) {
        console.log("Failed to write audit log:", error.message);
      }
    });
  }

  next();
};

module.exports = apiLogger;