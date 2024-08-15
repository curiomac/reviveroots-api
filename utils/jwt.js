const HandleResponse = require("../helpers/handleResponse");
const HTTP_STATUS_CODES = require("../utils/httpStatusCodes");
const RESPONSE = new HandleResponse();

const sendToken = (responseData, res, logMsg) => {
  const user = responseData.data;
  const jwt_token = user.getJwtToken();

  // Closing Logs
  console.log(logMsg);
  RESPONSE.handleSuccessResponse(
    HTTP_STATUS_CODES.OK,
    responseData.message,
    { user, jwt_token },
    res
  );
};

module.exports = sendToken;
