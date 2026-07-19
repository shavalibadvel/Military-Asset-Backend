var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
var User = require("../models/User");
var authMiddleware = require("../middleware/auth");

var login = async function (req, res) {
  try {
    var username = req.body.username;
    var password = req.body.password;

    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required." });
    }
    var user = await User.findOne({ username: username }).populate("base_id");
    if (!user) {
      return res.status(401).json({ error: "Invalid username or password." });
    }
    var isPasswordCorrect = bcrypt.compareSync(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({ error: "Invalid username or password." });
    }
    var tokenData = {
      id: user._id,
      username: user.username,
      full_name: user.full_name,
      role: user.role,
      base_id: user.base_id ? user.base_id._id : null,
      base_name: user.base_id ? user.base_id.name : null
    };

    var token = jwt.sign(tokenData, authMiddleware.JWT_SECRET, { expiresIn: "1h" });
    res.json({
      message: "Login successful",
      token: token,
      user: tokenData
    });

  } catch (error) {
    res.status(500).json({ error: "Server error: " + error.message });
  }
};


var getMe = function (req, res) {
  res.json({ user: req.user });
};

module.exports = {
  login: login,
  getMe: getMe
};