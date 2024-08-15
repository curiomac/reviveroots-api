const jwt = require("jsonwebtoken");
const { userModel: User } = require("../models/userModel");
const HandleResponse = require("../helpers/handleResponse");
const CLIENT_MESSAGES = require("../utils/clientResponseConstants");
const HTTP_STATUS_CODES = require("../utils/httpStatusCodes");
const RESPONSE = new HandleResponse();

exports.isAuthenticatedUser = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (!authorization) {
      RESPONSE.handleErrorResponse(
        HTTP_STATUS_CODES.UNAUTHORIZED,
        `${CLIENT_MESSAGES.ERROR_MESSAGES.AUTHENTICATION_ERROR}`,
        res
      );
      return;
    }
    const decoded = jwt.verify(authorization, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);    
    if (!req.user) {
      RESPONSE.handleErrorResponse(
        HTTP_STATUS_CODES.UNAUTHORIZED,
        `${CLIENT_MESSAGES.ERROR_MESSAGES.INVALID_TOKEN}`,
        res
      );
      return;
    }
    next();
  } catch (error) {
    RESPONSE.handleErrorResponse(
      HTTP_STATUS_CODES.UNAUTHORIZED,
      error.message,
      res
    );
  }
};
exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      RESPONSE.handleErrorResponse(
        HTTP_STATUS_CODES.UNAUTHORIZED,
        `Role ${req.user.role} is not allowed`,
        res
      );
      return;
    }
    next();
  };
};
