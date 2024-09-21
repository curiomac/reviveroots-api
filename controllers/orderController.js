const HandleResponse = require("../helpers/handleResponse");
const RESPONSE = new HandleResponse();
const HTTP_STATUS_CODES = require("../utils/httpStatusCodes");
const CLIENT_MESSAGES = require("../utils/clientResponseConstants");
const LOGGER_MESSAGES = require("../utils/logConstants");
const OrderService = require("../services/orderServices");
const CustomError = require("../helpers/customError");

// Creating a Service Instance
const OrderServiceInstance = OrderService();

// Get Order Details - /api/bytestation/v1/get/order_details
exports.getOrderDetails = async (req, res, next) => {
  try {
    // Initiating Logs
    console.log(LOGGER_MESSAGES.ORDER_DETAILS_FETCH);
    // Response from the Service
    const responseData = await OrderServiceInstance.getOrderDetails(req);
    // Closing Logs
    console.log(LOGGER_MESSAGES.ORDER_DETAILS_FETCH_COMPLETED);
    // Sending Response to Client
    RESPONSE.handleSuccessResponse(
      HTTP_STATUS_CODES.OK,
      responseData.message,
      responseData.data,
      res
    );
  } catch (error) {
    // Closing Logs
    console.log(LOGGER_MESSAGES.ORDER_DETAILS_FETCH_FAILED);
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

// Create Order - /api/bytestation/v1/create/order
exports.createOrder = async (req, res, next) => {
  try {
    // Initiating Logs
    console.log(LOGGER_MESSAGES.ORDER_CREATION);
    // Body Data
    const {
      email,
      firstName,
      postalCode,
      mobileNumber,
      addressLine1,
      location,
      district,
      state,
      country,
    } = req.body;
    // Checking required fields
    if (
      !email ||
      !firstName ||
      !postalCode ||
      !mobileNumber ||
      !addressLine1 ||
      !location ||
      !district ||
      !state ||
      !country
    ) {
      throw new CustomError(CLIENT_MESSAGES.ERROR_MESSAGES.EMPTY_FIELD_ERROR);
    }
    // Response from the Service
    const responseData = await OrderServiceInstance.createOrder(req.body, req);
    // Closing Logs
    console.log(LOGGER_MESSAGES.ORDER_CREATION_COMPLETED);
    // Sending Response to Client
    RESPONSE.handleSuccessResponse(
      HTTP_STATUS_CODES.OK,
      responseData.message,
      responseData.data,
      res
    );
  } catch (error) {
    // Closing Logs
    console.log(LOGGER_MESSAGES.ORDER_CREATION_FAILED);
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

// Get Order - /api/bytestation/v1/get/order
exports.getOrder = async (req, res, next) => {
  try {
    // Initiating Logs
    console.log(LOGGER_MESSAGES.ORDER_DETAILS_FETCH);
    // Body Data
    const { order_id } = req.query;
    // Checking required fields
    if (!order_id) {
      throw new CustomError(CLIENT_MESSAGES.ERROR_MESSAGES.EMPTY_FIELD_ERROR);
    }
    // Response from the Service
    const responseData = await OrderServiceInstance.getOrder(order_id, req);
    // Closing Logs
    console.log(LOGGER_MESSAGES.ORDER_DETAILS_FETCH_COMPLETED);
    // Sending Response to Client
    RESPONSE.handleSuccessResponse(
      HTTP_STATUS_CODES.OK,
      responseData.message,
      responseData.data,
      res
    );
  } catch (error) {
    // Closing Logs
    console.log(LOGGER_MESSAGES.ORDER_DETAILS_FETCH_FAILED);
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
// Get Orders - /api/bytestation/v1/get/orders
exports.getOrders = async (req, res, next) => {
  try {
    // Initiating Logs
    console.log(LOGGER_MESSAGES.ORDERS_FETCH);
    // Response from the Service
    const responseData = await OrderServiceInstance.getOrders(req.query, req);
    // Closing Logs
    console.log(LOGGER_MESSAGES.ORDERS_FETCH_COMPLETED);
    // Sending Response to Client
    RESPONSE.handleSuccessResponse(
      HTTP_STATUS_CODES.OK,
      responseData.message,
      responseData.data,
      res
    );
  } catch (error) {
    // Closing Logs
    console.log(LOGGER_MESSAGES.ORDERS_FETCH_FAILED);
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
// Get All Orders - /api/bytestation/v1/get/all/orders
exports.getAllOrders = async (req, res, next) => {
  try {
    // Initiating Logs
    console.log(LOGGER_MESSAGES.ORDERS_FETCH);
    // Response from the Service
    const responseData = await OrderServiceInstance.getAllOrders(req);
    // Closing Logs
    console.log(LOGGER_MESSAGES.ORDERS_FETCH_COMPLETED);
    // Sending Response to Client
    RESPONSE.handleSuccessResponse(
      HTTP_STATUS_CODES.OK,
      responseData.message,
      responseData.data,
      res
    );
  } catch (error) {
    // Closing Logs
    console.log(LOGGER_MESSAGES.ORDERS_FETCH_FAILED);
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
