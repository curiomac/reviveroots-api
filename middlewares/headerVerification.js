const HandleResponse = require("../helpers/handleResponse");
const CLIENT_MESSAGES = require("../utils/clientResponseConstants");
const HTTP_STATUS_CODES = require("../utils/httpStatusCodes");
const RESPONSE = new HandleResponse();

exports.headerVerification = async (req, res, next) => {
  const X_VERIFICATION_TOKEN = process.env["X_VERIFY_TOKEN"];
  const verificationToken = req.headers["x-verification-token"];
  if (!verificationToken || verificationToken !== X_VERIFICATION_TOKEN) {
    RESPONSE.handleErrorResponse(
      HTTP_STATUS_CODES.UNAUTHORIZED,
      `${CLIENT_MESSAGES.ERROR_MESSAGES["INVALID_X_VERIFY_TOKEN"]}`,
      res
    );
    return;
  }
  next();
};
