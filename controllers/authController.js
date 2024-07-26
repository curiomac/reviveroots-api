const User = require("../models/userModel");
const sendToken = require("../utils/jwt");

// register user - /api/v1/register
exports.registerUser = async (req, res, next) => {
  const { email, otp } = req.body;

  const user = { email, otp };

  sendToken(user, 201, res, "Registered successfully");
};
