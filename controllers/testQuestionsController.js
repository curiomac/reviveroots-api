const HandleResponse = require("../helpers/handleResponse");
const RESPONSE = new HandleResponse();
const HTTP_STATUS_CODES = require("../utils/httpStatusCodes");
const CLIENT_MESSAGES = require("../utils/clientResponseConstants");
const LOGGER_MESSAGES = require("../utils/logConstants");
const TestQuestionsService = require("../services/testQuestionsServices");
const CustomError = require("../helpers/customError");

// Creating a Service Instance
const TestQuestionsServiceInstance = TestQuestionsService();

// Create TestQuestions - /api/bytestation/v1/create/testquestions
exports.createTestQuestions = async (req, res, next) => {
  try {
    // Initiating Logs
    console.log(LOGGER_MESSAGES.TEST_QUESTIONS_CREATION);
    // Body Data
    const { userName, email, mobileNumber, age, gender, testQuestions } =
      req.body;
    // Checking required fields
    if (
      !userName ||
      !email ||
      !age ||
      !mobileNumber ||
      !gender ||
      Object.keys(testQuestions).length === 0
    ) {
      throw new CustomError(CLIENT_MESSAGES.ERROR_MESSAGES.EMPTY_FIELD_ERROR);
    }
    // Response from the Service
    const responseData = await TestQuestionsServiceInstance.createTestQuestions(
      req.body,
      req
    );
    // Closing Logs
    console.log(LOGGER_MESSAGES.TEST_QUESTIONS_CREATION_COMPLETED);
    // Sending Response to Client
    RESPONSE.handleSuccessResponse(
      HTTP_STATUS_CODES.OK,
      responseData.message,
      responseData.data,
      res
    );
  } catch (error) {
    // Closing Logs
    console.log(LOGGER_MESSAGES.TEST_QUESTIONS_CREATION_FAILED);
    // Logging Catched Error
    console.log("Error: ", error);
    // Sending Response to Client
    RESPONSE.handleErrorResponse(
      HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
      error.message,
      res
    );
  }
};
// Get TestQuestions - /api/bytestation/v1/get/testquestions
exports.getTestQuestions = async (req, res, next) => {
  try {
    // Initiating Logs
    console.log(LOGGER_MESSAGES.TEST_QUESTIONSES_FETCH);
    // Response from the Service
    const responseData = await TestQuestionsServiceInstance.getTestQuestions(
      req
    );
    // Closing Logs
    console.log(LOGGER_MESSAGES.TEST_QUESTIONSES_FETCH_COMPLETED);
    // Sending Response to Client
    RESPONSE.handleSuccessResponse(
      HTTP_STATUS_CODES.OK,
      responseData.message,
      responseData.data,
      res
    );
  } catch (error) {
    // Closing Logs
    console.log(LOGGER_MESSAGES.TEST_QUESTIONSES_FETCH_FAILED);
    // Logging Catched Error
    console.log("Error: ", error);
    // Sending Response to Client
    RESPONSE.handleErrorResponse(
      HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
      error.message,
      res
    );
  }
};
