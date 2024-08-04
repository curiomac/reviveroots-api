const HandleResponse = require("../helpers/handleResponse");
const HTTP_STATUS_CODES = require("../utils/httpStatusCodes");
const LOGGER_MESSAGES = require("./logConstants");
const RESPONSE = new HandleResponse();

const sendToken = (responseData, res) => {
  const user = responseData.data;
  const jwt_token = user.getJwtToken();

  // Closing Logs
  console.log(
    LOGGER_MESSAGES.CONTROLLER + LOGGER_MESSAGES.REGISTER_USER_COMPLETED
  );
  RESPONSE.handleSuccessResponse(
    HTTP_STATUS_CODES.OK,
    responseData.message,
    { user, jwt_token },
    res
  );
};

module.exports = sendToken;
