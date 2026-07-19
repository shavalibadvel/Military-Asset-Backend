var mongoose = require("mongoose");

var auditLogSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  username: {
    type: String
  },
  action: {
    type: String,
    required: true
  },
  details: {
    type: String
  },
  ip_address: {
    type: String
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

var AuditLog = mongoose.model("AuditLog", auditLogSchema);

module.exports = AuditLog;