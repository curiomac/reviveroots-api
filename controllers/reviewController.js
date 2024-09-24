const HandleResponse = require("../helpers/handleResponse");
const RESPONSE = new HandleResponse();
const HTTP_STATUS_CODES = require("../utils/httpStatusCodes");
const CLIENT_MESSAGES = require("../utils/clientResponseConstants");
const LOGGER_MESSAGES = require("../utils/logConstants");
const ReviewService = require("../services/reviewServices");
const CustomError = require("../helpers/customError");
const { consoleHighlighted } = require("../utils/chalk");

// Creating a Service Instance
const ReviewServiceInstance = ReviewService();

// Create Review - /api/bytestation/v1/create/review
exports.createReview = async (req, res, next) => {
  try {
    // Initiating Logs
    consoleHighlighted.initiate(LOGGER_MESSAGES.REVIEW_CREATION);
    // Body Data
    const { productId, ratingValue, reviewTitle, reviewDetails } = req.body;
    "req.body: ", req.body;

    // Checking required fields
    if (!productId || !ratingValue || !reviewTitle || !reviewDetails) {
      throw new CustomError(CLIENT_MESSAGES.ERROR_MESSAGES.EMPTY_FIELD_ERROR);
    }
    // Response from the Service
    const responseData = await ReviewServiceInstance.createReview(
      req.body,
      req
    );
    // Closing Logs
    consoleHighlighted.success(LOGGER_MESSAGES.REVIEW_CREATION_COMPLETED);
    // Sending Response to Client
    RESPONSE.handleSuccessResponse(
      HTTP_STATUS_CODES.OK,
      responseData.message,
      responseData.data,
      res
    );
  } catch (error) {
    // Closing Logs
    consoleHighlighted.error(LOGGER_MESSAGES.REVIEW_CREATION_FAILED);
    // Logging Catched Error
    consoleHighlighted.error("", error);
    // Sending Response to Client
    RESPONSE.handleErrorResponse(
      HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
      error.message,
      res
    );
  }
};
// Update Review - /api/bytestation/v1/update/review
exports.updateReview = async (req, res, next) => {
  try {
    // Initiating Logs
    consoleHighlighted.initiate(LOGGER_MESSAGES.REVIEW_UPDATE);
    // Body Data
    const { reviewId, productId, ratingValue, reviewTitle, reviewDetails } =
      req.body;
      console.log("req.body: ", req.body);
      
    // Checking required fields
    if (
      !productId ||
      !ratingValue ||
      !reviewTitle ||
      !reviewDetails ||
      !reviewId
    ) {
      throw new CustomError(CLIENT_MESSAGES.ERROR_MESSAGES.EMPTY_FIELD_ERROR);
    }
    // Response from the Service
    const responseData = await ReviewServiceInstance.updateReview(
      req.body,
      req
    );
    // Closing Logs
    consoleHighlighted.success(LOGGER_MESSAGES.REVIEW_UPDATE_COMPLETED);
    // Sending Response to Client
    RESPONSE.handleSuccessResponse(
      HTTP_STATUS_CODES.OK,
      responseData.message,
      responseData.data,
      res
    );
  } catch (error) {
    // Closing Logs
    consoleHighlighted.error(LOGGER_MESSAGES.REVIEW_UPDATE_FAILED);
    // Logging Catched Error
    consoleHighlighted.error("", error);
    // Sending Response to Client
    RESPONSE.handleErrorResponse(
      HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
      error.message,
      res
    );
  }
};
// Get Reviews - /api/bytestation/v1/get/reviews
exports.getReviews = async (req, res, next) => {
  try {
    // Initiating Logs
    consoleHighlighted.initiate(LOGGER_MESSAGES.REVIEWS_FETCH);
    // Query Data
    const { product_id } = req.query;
    // Checking required fields
    if (!product_id) {
      throw new CustomError(CLIENT_MESSAGES.ERROR_MESSAGES.EMPTY_FIELD_ERROR);
    }
    // Response from the Service
    const responseData = await ReviewServiceInstance.getReviews(
      product_id,
      req
    );
    // Closing Logs
    consoleHighlighted.success(LOGGER_MESSAGES.REVIEWS_FETCH_COMPLETED);
    // Sending Response to Client
    RESPONSE.handleSuccessResponse(
      HTTP_STATUS_CODES.OK,
      responseData.message,
      responseData.data,
      res
    );
  } catch (error) {
    // Closing Logs
    consoleHighlighted.error(LOGGER_MESSAGES.REVIEWS_FETCH_FAILED);
    // Logging Catched Error
    consoleHighlighted.error("", error);
    // Sending Response to Client
    RESPONSE.handleErrorResponse(
      HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
      error.message,
      res
    );
  }
};
// Delete Review - /api/bytestation/v1/delete/review
exports.deleteReview = async (req, res, next) => {
  try {
    // Initiating Logs
    consoleHighlighted.initiate(LOGGER_MESSAGES.REVIEW_DELETE);
    // Query Data
    const { product_id } = req.query;
    console.log("product_id: ", product_id);
    
    // Checking required fields
    if (!product_id) {
      throw new CustomError(CLIENT_MESSAGES.ERROR_MESSAGES.EMPTY_FIELD_ERROR);
    }
    // Response from the Service
    const responseData = await ReviewServiceInstance.deleteReview(
      product_id,
      req
    );
    // Closing Logs
    consoleHighlighted.success(LOGGER_MESSAGES.REVIEW_DELETE_COMPLETED);
    // Sending Response to Client
    RESPONSE.handleSuccessResponse(
      HTTP_STATUS_CODES.OK,
      responseData.message,
      responseData.data,
      res
    );
  } catch (error) {
    // Closing Logs
    consoleHighlighted.error(LOGGER_MESSAGES.REVIEW_DELETE_FAILED);
    // Logging Catched Error
    consoleHighlighted.error("", error);
    // Sending Response to Client
    RESPONSE.handleErrorResponse(
      HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
      error.message,
      res
    );
  }
};
