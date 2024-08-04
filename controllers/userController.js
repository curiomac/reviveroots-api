const CustomError = require("../helpers/customError");
const HandleResponse = require("../helpers/handleResponse");
const UserService = require("../services/userServices");
const CLIENT_MESSAGES = require("../utils/clientResponseConstants");
const HTTP_STATUS_CODES = require("../utils/httpStatusCodes");
const sendToken = require("../utils/jwt");
const LOGGER_MESSAGES = require("../utils/logConstants");
const RESPONSE = new HandleResponse();

// Creating a Service Instance
const UserServiceInstance = UserService();

// send secret code email - /api/v1/send/secret_code
exports.sendSecretCode = async (req, res) => {
  try {
    // Initiating Logs
    console.log(LOGGER_MESSAGES.CONTROLLER + LOGGER_MESSAGES.SECRET_CODE_SEND);
    // Body data
    const userData = req.body;
    const { email, authCode } = req.body;
    // Checking required fields
    if (!email || !authCode) {
      throw new CustomError(CLIENT_MESSAGES.ERROR_MESSAGES.EMPTY_FIELD_ERROR);
    }
    // Response from the Service
    const responseData = await UserServiceInstance.sendSecretCode(
      userData,
      req
    );
    // Closing Logs
    console.log(
      LOGGER_MESSAGES.CONTROLLER + LOGGER_MESSAGES.SECRET_CODE_SEND_COMPLETED
    );
    // Sending Response to Client
    RESPONSE.handleSuccessResponse(
      HTTP_STATUS_CODES.OK,
      responseData.message,
      {},
      res
    );
  } catch (error) {
    // Closing Logs
    console.log(
      LOGGER_MESSAGES.CONTROLLER + LOGGER_MESSAGES.SECRET_CODE_SEND_FAILED
    );
     // Sending Response to Client
    RESPONSE.handleErrorResponse(
      HTTP_STATUS_CODES.BAD_REQUEST,
      error.message,
      res
    );
  }
};

// register user - /api/v1/create/user
exports.registerUser = async (req, res, next) => {
  try {
    // Initiating Logs
    console.log(LOGGER_MESSAGES.CONTROLLER + LOGGER_MESSAGES.REGISTER_USER);
    // Body Data
    const userData = req.body;
    const { firstName, mobileNumber, email, secretCodeClient } = req.body;
    // Checking required fields
    if (!email || !firstName || !mobileNumber || !secretCodeClient) {
      throw new CustomError(CLIENT_MESSAGES.ERROR_MESSAGES.EMPTY_FIELD_ERROR);
    }
    // Response from the Service
    const responseData = await UserServiceInstance.registerUser(userData, req);
    // Sending Response to Client
    sendToken(responseData, res);
  } catch (error) {
    // Closing Logs
    console.log(
      LOGGER_MESSAGES.CONTROLLER + LOGGER_MESSAGES.REGISTER_USER_FAILED
    );
    // Logging Catched Error
    console.log(LOGGER_MESSAGES.CONTROLLER + error);
    // Sending Response to Client
    RESPONSE.handleErrorResponse(
      HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
      error.message,
      res
    );
  }
};
// login user - /api/v1/login
exports.loginUser = async (req, res, next) => {
  try {
    // Initiating Logs
    console.log(LOGGER_MESSAGES.CONTROLLER + LOGGER_MESSAGES.LOGIN_USER);
    // Body Data
    const userData = req.body;
    const { email, secretCodeClient } = req.body;
    // Checking required fields
    if (!email || !secretCodeClient) {
      throw new CustomError(CLIENT_MESSAGES.ERROR_MESSAGES.EMPTY_FIELD_ERROR);
    }
    // Response from the Service
    const responseData = await UserServiceInstance.loginUser(userData, req);
    // Closing Logs
    console.log(LOGGER_MESSAGES.CONTROLLER + LOGGER_MESSAGES.LOGIN_COMPLETED);
    // Sending Response to Client
    sendToken(responseData, res);
  } catch (error) {
    // Closing Logs
    console.log(LOGGER_MESSAGES.CONTROLLER + LOGGER_MESSAGES.LOGIN_FAILED);
    // Logging Catched Error
    console.log(LOGGER_MESSAGES.CONTROLLER + error);
    // Sending Response to Client
    RESPONSE.handleErrorResponse(
      HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
      error.message,
      res
    );
  }
};
// get profile - /api/v1/get/profile
exports.getProfile = async (req, res, next) => {
  try {
    // Initiating Logs
    console.log(LOGGER_MESSAGES.CONTROLLER + LOGGER_MESSAGES.PRODUCTS_FETCH);
    // Response from the Service
    const responseData = await UserServiceInstance.getProfile(req);
    // Closing Logs
    console.log(
      LOGGER_MESSAGES.CONTROLLER + LOGGER_MESSAGES.PRODUCTS_FETCH_COMPLETED
    );
    // Sending Response to Client
    RESPONSE.handleSuccessResponse(
      HTTP_STATUS_CODES.OK,
      responseData.message,
      responseData.data,
      res
    );
  } catch (error) {
    // Closing Logs
    console.log(
      LOGGER_MESSAGES.CONTROLLER + LOGGER_MESSAGES.PRODUCTS_FETCH_FAILED
    );
    // Logging Catched Error
    console.log(LOGGER_MESSAGES.CONTROLLER + error);
    // Sending Response to Client
    RESPONSE.handleErrorResponse(
      HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
      error,
      res
    );
  }
};
