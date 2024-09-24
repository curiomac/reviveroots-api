const HandleResponse = require("../helpers/handleResponse");
const RESPONSE = new HandleResponse();
const HTTP_STATUS_CODES = require("../utils/httpStatusCodes");
const CLIENT_MESSAGES = require("../utils/clientResponseConstants");
const LOGGER_MESSAGES = require("../utils/logConstants");
const CartService = require("../services/cartServices");
const CustomError = require("../helpers/customError");
const { consoleHighlighted } = require("../utils/chalk");

// Creating a Service Instance
const CartServiceInstance = CartService();

// Add To Cart - /api/bytestation/v1/add/cart
exports.addToCart = async (req, res, next) => {
  try {
    // Initiating Logs
    consoleHighlighted.initiate(LOGGER_MESSAGES.ADD_TO_CART);
    // Body Data
    const { productId } = req.body;
    // Checking required fields
    if (!productId) {
      throw new CustomError(CLIENT_MESSAGES.ERROR_MESSAGES.EMPTY_FIELD_ERROR);
    }
    // Response from the Service
    const responseData = await CartServiceInstance.addToCart(req.body, req);
    // Closing Logs
    consoleHighlighted.success(LOGGER_MESSAGES.ADD_TO_CART_COMPLETED);
    // Sending Response to Client
    RESPONSE.handleSuccessResponse(
      HTTP_STATUS_CODES.OK,
      responseData.message,
      responseData.data,
      res
    );
  } catch (error) {
    // Closing Logs
    consoleHighlighted.error(LOGGER_MESSAGES.ADD_TO_CART_FAILED);
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
// Get Cart Items - /api/bytestation/v1/get/cart
exports.getCartItems = async (req, res, next) => {
  try {
    // Initiating Logs
    consoleHighlighted.initiate(LOGGER_MESSAGES.GET_CART_ITEMS);
    // Response from the Service
    const responseData = await CartServiceInstance.getCartItems(req);
    // Closing Logs
    consoleHighlighted.success(LOGGER_MESSAGES.GET_CART_ITEMS_COMPLETED);
    // Sending Response to Client
    RESPONSE.handleSuccessResponse(
      HTTP_STATUS_CODES.OK,
      responseData.message,
      responseData.data,
      res
    );
  } catch (error) {
    // Closing Logs
    consoleHighlighted.error(LOGGER_MESSAGES.GET_CART_ITEMS_FAILED);
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
// Get Checkout Details Items - /api/bytestation/v1/get/checkout_details
exports.getCheckoutDetails = async (req, res, next) => {
  try {
    // Initiating Logs
    consoleHighlighted.initiate(LOGGER_MESSAGES.GET_CART_ITEMS);
    // Response from the Service
    const responseData = await CartServiceInstance.getCartItems(req);
    // Closing Logs
    consoleHighlighted.success(LOGGER_MESSAGES.GET_CART_ITEMS_COMPLETED);
    // Sending Response to Client
    RESPONSE.handleSuccessResponse(
      HTTP_STATUS_CODES.OK,
      responseData.message,
      responseData.data,
      res
    );
  } catch (error) {
    // Closing Logs
    consoleHighlighted.error(LOGGER_MESSAGES.GET_CART_ITEMS_FAILED);
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
