const HandleResponse = require("../helpers/handleResponse");
const Product = require("../models/productModel");
const RESPONSE = new HandleResponse();
const HTTP_STATUS_CODES = require("../utils/httpStatusCodes");
const CLIENT_MESSAGES = require("../utils/clientResponseConstants");
const LOGGER_MESSAGES = require("../utils/logConstants");
const ProductService = require("../services/productServices");

// Create Product - /api/bytestation/v1/create/product
exports.createProduct = async (req, res, next) => {
  try {
    // Initiating Logs
    console.log(LOGGER_MESSAGES.PRODUCT_CREATION);

    // Body Data
    const productData = req.body;

    // Creating a Service Instance
    const ProductServiceInstance = ProductService();

    // Response from the Service
    const responseData = await ProductServiceInstance.createProduct(
      productData,
      req
    );

    // Closing Logs
    console.log(LOGGER_MESSAGES.PRODUCT_CREATION_COMPLETED);

    // Sending Response to Client
    RESPONSE.handleSuccessResponse(
      HTTP_STATUS_CODES.OK,
      responseData.message,
      responseData.data,
      res
    );
  } catch (err) {
    // Closing Logs
    console.log(LOGGER_MESSAGES.PRODUCT_CREATION_FAILED);

    // Logging Catch Error
    console.log("Error: ", err);

    // Sending Response to Client
    RESPONSE.handleErrorResponse(
      HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
      CLIENT_MESSAGES.ERROR_MESSAGES.PRODUCT_CREATION_FAILED,
      res
    );
  }
};

// Get Products - /api/bytestation/v1/get/products
exports.getProducts = async (req, res, next) => {
  try {
    // Initiating Logs
    console.log(LOGGER_MESSAGES.PRODUCTS_FETCH);

    // Body Data
    const productData = {};

    // Creating a Service Instance
    const ProductServiceInstance = ProductService();

    // Response from the Service
    const responseData = await ProductServiceInstance.getProducts(
      productData,
      req
    );

    // Closing Logs
    console.log(LOGGER_MESSAGES.PRODUCTS_FETCH_COMPLETED);

    // Sending Response to Client
    RESPONSE.handleSuccessResponse(
      HTTP_STATUS_CODES.OK,
      responseData.message,
      responseData.data,
      res
    );
  } catch (err) {
    // Closing Logs
    console.log(LOGGER_MESSAGES.PRODUCTS_FETCH_FAILED);

    // Logging Catch Error
    console.log("Error: ", err);

    // Sending Response to Client
    RESPONSE.handleErrorResponse(
      HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
      CLIENT_MESSAGES.ERROR_MESSAGES.PRODUCTS_FETCH_FAILED,
      res
    );
  }
};
