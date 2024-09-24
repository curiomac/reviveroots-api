const HandleResponse = require("../helpers/handleResponse");
const RESPONSE = new HandleResponse();
const HTTP_STATUS_CODES = require("../utils/httpStatusCodes");
const CLIENT_MESSAGES = require("../utils/clientResponseConstants");
const LOGGER_MESSAGES = require("../utils/logConstants");
const ProductService = require("../services/productServices");
const CustomError = require("../helpers/customError");
const { consoleHighlighted } = require("../utils/chalk")

// Creating a Service Instance
const ProductServiceInstance = ProductService();

// Create Product - /api/bytestation/v1/create/product
exports.createProduct = async (req, res, next) => {
  try {
    // Initiating Logs
    consoleHighlighted.initiate(LOGGER_MESSAGES.PRODUCT_CREATION);
    // Body Data
    const {
      productName,
      alternateName,
      description,
      subDescription,
      unitPrice,
      profitPercentage,
      availableSizes,
    } = req.body;
    // Checking required fields
    if (
      !productName ||
      !alternateName ||
      !description ||
      !subDescription ||
      !unitPrice ||
      !profitPercentage ||
      !availableSizes
    ) {
      throw new CustomError(CLIENT_MESSAGES.ERROR_MESSAGES.EMPTY_FIELD_ERROR);
    }
    // Response from the Service
    const responseData = await ProductServiceInstance.createProduct(
      req.body,
      req
    );
  // Closing Logs
    consoleHighlighted.success(LOGGER_MESSAGES.PRODUCT_CREATION_COMPLETED);
    // Sending Response to Client
    RESPONSE.handleSuccessResponse(
      HTTP_STATUS_CODES.OK,
      responseData.message,
      responseData.data,
      res
    );
  } catch (error) {
    // Closing Logs
    consoleHighlighted.error(LOGGER_MESSAGES.PRODUCT_CREATION_FAILED);
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

// Update Product - /api/bytestation/v1/update/product
exports.updateProduct = async (req, res, next) => {
  try {
    // Initiating Logs
    consoleHighlighted.initiate(LOGGER_MESSAGES.PRODUCT_UPDATE);
    // Body Data
    const {
      productName,
      alternateName,
      description,
      subDescription,
      unitPrice,
      profitPercentage,
      availableSizes,
    } = req.body;
    // Checking required fields
    if (
      !productName ||
      !alternateName ||
      !description ||
      !subDescription ||
      !unitPrice ||
      !profitPercentage ||
      !availableSizes
    ) {
      throw new CustomError(CLIENT_MESSAGES.ERROR_MESSAGES.EMPTY_FIELD_ERROR);
    }
    // Response from the Service
    const responseData = await ProductServiceInstance.updateProduct(
      req.body,
      req
    );
  // Closing Logs
    consoleHighlighted.success(LOGGER_MESSAGES.PRODUCT_UPDATE_COMPLETED);
    // Sending Response to Client
    RESPONSE.handleSuccessResponse(
      HTTP_STATUS_CODES.OK,
      responseData.message,
      responseData.data,
      res
    );
  } catch (error) {
    // Closing Logs
    consoleHighlighted.error(LOGGER_MESSAGES.PRODUCT_UPDATE_FAILED);
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

// Get Products - /api/bytestation/v1/get/products
exports.getProducts = async (req, res, next) => {
  try {
    // Initiating Logs
    consoleHighlighted.initiate(LOGGER_MESSAGES.PRODUCTS_FETCH);
    // Response from the Service
    const responseData = await ProductServiceInstance.getProducts(req);
    // Closing Logs
    consoleHighlighted.success(LOGGER_MESSAGES.PRODUCTS_FETCH_COMPLETED);
    // Sending Response to Client
    RESPONSE.handleSuccessResponse(
      HTTP_STATUS_CODES.OK,
      responseData.message,
      responseData.data,
      res
    );
  } catch (error) {
    // Closing Logs
    consoleHighlighted.error(LOGGER_MESSAGES.PRODUCTS_FETCH_FAILED);
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
// Get Category Products - /api/bytestation/v1/get/category/products
exports.getCategoryProducts = async (req, res, next) => {
  try {
    // Initiating Logs
    consoleHighlighted.initiate(LOGGER_MESSAGES.CATEGORY_PRODUCTS_FETCH);
    // Response from the Service
    const responseData = await ProductServiceInstance.getCategoryProducts(req);
  // Closing Logs
    consoleHighlighted.success(LOGGER_MESSAGES.CATEGORY_PRODUCTS_FETCH_COMPLETED);
    // Sending Response to Client
    RESPONSE.handleSuccessResponse(
      HTTP_STATUS_CODES.OK,
      responseData.message,
      responseData.data,
      res
    );
  } catch (error) {
    // Closing Logs
    consoleHighlighted.error(LOGGER_MESSAGES.CATEGORY_PRODUCTS_FETCH_FAILED);
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
// Get Recent Products - /api/bytestation/v1/get/recent/products
exports.getRecentProducts = async (req, res, next) => {
  try {
    // Initiating Logs
    consoleHighlighted.initiate(LOGGER_MESSAGES.RECENT_PRODUCTS_FETCH);
    // Query Data
    const { product_ids } = req.query;

    // Checking required fields
    if (!product_ids) {
      throw new CustomError(CLIENT_MESSAGES.ERROR_MESSAGES.EMPTY_FIELD_ERROR);
    }
    // Response from the Service
    const responseData = await ProductServiceInstance.getRecentProducts(
      product_ids,
      req
    );
  // Closing Logs
    consoleHighlighted.success(LOGGER_MESSAGES.RECENT_PRODUCTS_FETCH_COMPLETED);
    // Sending Response to Client
    RESPONSE.handleSuccessResponse(
      HTTP_STATUS_CODES.OK,
      responseData.message,
      responseData.data,
      res
    );
  } catch (error) {
    // Closing Logs
    consoleHighlighted.error(LOGGER_MESSAGES.RECENT_PRODUCTS_FETCH_FAILED);
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
// Get Similar Products - /api/bytestation/v1/get/similar/products
exports.getSimilarProducts = async (req, res, next) => {
  try {
    // Initiating Logs
    consoleHighlighted.initiate(LOGGER_MESSAGES.SIMILAR_PRODUCTS_FETCH);
    // Query Data
    const { productTags } = req.query;

    // Checking required fields
    if (!productTags) {
      throw new CustomError(CLIENT_MESSAGES.ERROR_MESSAGES.EMPTY_FIELD_ERROR);
    }
    // Response from the Service
    const responseData = await ProductServiceInstance.getSimilarProducts(
      req.query,
      req
    );
  // Closing Logs
    consoleHighlighted.success(LOGGER_MESSAGES.SIMILAR_PRODUCTS_FETCH_COMPLETED);
    // Sending Response to Client
    RESPONSE.handleSuccessResponse(
      HTTP_STATUS_CODES.OK,
      responseData.message,
      responseData.data,
      res
    );
  } catch (error) {
    // Closing Logs
    consoleHighlighted.error(LOGGER_MESSAGES.SIMILAR_PRODUCTS_FETCH_FAILED);
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
// Get Popular Products - /api/bytestation/v1/get/popular/products
exports.getPopularProducts = async (req, res, next) => {
  try {
    // Initiating Logs
    consoleHighlighted.initiate(LOGGER_MESSAGES.POPULAR_PRODUCTS_FETCH);
    // Response from the Service
    const responseData = await ProductServiceInstance.getPopularProducts(req);
  // Closing Logs
    consoleHighlighted.success(LOGGER_MESSAGES.POPULAR_PRODUCTS_FETCH_COMPLETED);
    // Sending Response to Client
    RESPONSE.handleSuccessResponse(
      HTTP_STATUS_CODES.OK,
      responseData.message,
      responseData.data,
      res
    );
  } catch (error) {
    // Closing Logs
    consoleHighlighted.error(LOGGER_MESSAGES.POPULAR_PRODUCTS_FETCH_FAILED);
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
// Get Recommended Products - /api/bytestation/v1/get/recommended/products
exports.getRecommendedProducts = async (req, res, next) => {
  try {
    // Initiating Logs
    consoleHighlighted.initiate(LOGGER_MESSAGES.RECOMMENDED_PRODUCTS_FETCH);
    // Response from the Service
    const responseData = await ProductServiceInstance.getRecommendedProducts(
      req
    );
  // Closing Logs
    consoleHighlighted.success(LOGGER_MESSAGES.RECOMMENDED_PRODUCTS_FETCH_COMPLETED);
    // Sending Response to Client
    RESPONSE.handleSuccessResponse(
      HTTP_STATUS_CODES.OK,
      responseData.message,
      responseData.data,
      res
    );
  } catch (error) {
    // Closing Logs
    consoleHighlighted.error(LOGGER_MESSAGES.RECOMMENDED_PRODUCTS_FETCH_COMPLETED);
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
// Get Product - /api/bytestation/v1/get/product
exports.getProduct = async (req, res, next) => {
  try {
    // Initiating Logs
    consoleHighlighted.initiate(LOGGER_MESSAGES.PRODUCT_FETCH);
    // Query Data
    const { product_id } = req.query;
    // Checking required fields
    if (!product_id) {
      throw new CustomError(CLIENT_MESSAGES.ERROR_MESSAGES.EMPTY_FIELD_ERROR);
    }
    // Response from the Service
    const responseData = await ProductServiceInstance.getProduct(
      product_id,
      req
    );
  // Closing Logs
    consoleHighlighted.success(LOGGER_MESSAGES.PRODUCT_FETCH_COMPLETED);
    // Sending Response to Client
    RESPONSE.handleSuccessResponse(
      HTTP_STATUS_CODES.OK,
      responseData.message,
      responseData.data,
      res
    );
  } catch (error) {
    // Closing Logs
    consoleHighlighted.error(LOGGER_MESSAGES.PRODUCT_FETCH_FAILED);
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
// Delete Product - /api/bytestation/v1/delete/product
exports.deleteProduct = async (req, res, next) => {
  try {
    // Initiating Logs
    consoleHighlighted.initiate(LOGGER_MESSAGES.PRODUCT_DELETE);
    // Query Data
    const { product_id } = req.query;
    // Checking required fields
    if (!product_id) {
      throw new CustomError(CLIENT_MESSAGES.ERROR_MESSAGES.EMPTY_FIELD_ERROR);
    }
    // Response from the Service
    const responseData = await ProductServiceInstance.deleteProduct(
      product_id,
      req
    );
  // Closing Logs
    consoleHighlighted.success(LOGGER_MESSAGES.PRODUCT_DELETE_COMPLETED);
    // Sending Response to Client
    RESPONSE.handleSuccessResponse(
      HTTP_STATUS_CODES.OK,
      responseData.message,
      responseData.data,
      res
    );
  } catch (error) {
    // Closing Logs
    consoleHighlighted.error(LOGGER_MESSAGES.PRODUCT_DELETE_FAILED);
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
