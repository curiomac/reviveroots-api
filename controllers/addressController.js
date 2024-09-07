const HandleResponse = require("../helpers/handleResponse");
const RESPONSE = new HandleResponse();
const HTTP_STATUS_CODES = require("../utils/httpStatusCodes");
const CLIENT_MESSAGES = require("../utils/clientResponseConstants");
const LOGGER_MESSAGES = require("../utils/logConstants");
const AddressService = require("../services/addressServices");
const CustomError = require("../helpers/customError");

// Creating a Service Instance
const AddressServiceInstance = AddressService();

// Create Address - /api/bytestation/v1/create/address
exports.createAddress = async (req, res, next) => {
  try {
    // Initiating Logs
    console.log(LOGGER_MESSAGES.ADDRESS_CREATION);
    // Body Data
    const {
      addressName,
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
      !addressName ||
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
    const responseData = await AddressServiceInstance.createAddress(
      req.body,
      req
    );
    // Closing Logs
    console.log(LOGGER_MESSAGES.ADDRESS_CREATION_COMPLETED);
    // Sending Response to Client
    RESPONSE.handleSuccessResponse(
      HTTP_STATUS_CODES.OK,
      responseData.message,
      responseData.data,
      res
    );
  } catch (error) {
    // Closing Logs
    console.log(LOGGER_MESSAGES.ADDRESS_CREATION_FAILED);
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
// Update Address - /api/bytestation/v1/update/address
exports.updateAddress = async (req, res, next) => {
  try {
    // Initiating Logs
    console.log(LOGGER_MESSAGES.ADDRESS_UPDATE);
    // Body Data
    const {
      addressName,
      firstName,
      postalCode,
      mobileNumber,
      addressLine1,
      location,
      district,
      state,
      country,
      addressId,
    } = req.body;
    // Checking required fields
    if (
      !addressName ||
      !firstName ||
      !postalCode ||
      !mobileNumber ||
      !addressLine1 ||
      !location ||
      !district ||
      !state ||
      !country ||
      !addressId
    ) {
      throw new CustomError(CLIENT_MESSAGES.ERROR_MESSAGES.EMPTY_FIELD_ERROR);
    }
    // Response from the Service
    const responseData = await AddressServiceInstance.updateAddress(
      req.body,
      req
    );
    // Closing Logs
    console.log(LOGGER_MESSAGES.ADDRESS_UPDATE_COMPLETED);
    // Sending Response to Client
    RESPONSE.handleSuccessResponse(
      HTTP_STATUS_CODES.OK,
      responseData.message,
      responseData.data,
      res
    );
  } catch (error) {
    // Closing Logs
    console.log(LOGGER_MESSAGES.ADDRESS_UPDATE_FAILED);
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
// Get Addresses - /api/bytestation/v1/get/addresses
exports.getAddresses = async (req, res, next) => {
  try {
    // Initiating Logs
    console.log(LOGGER_MESSAGES.ADDRESSES_FETCH);
    // Response from the Service
    const responseData = await AddressServiceInstance.getAddresses(req);
    // Closing Logs
    console.log(LOGGER_MESSAGES.ADDRESSES_FETCH_COMPLETED);
    // Sending Response to Client
    RESPONSE.handleSuccessResponse(
      HTTP_STATUS_CODES.OK,
      responseData.message,
      responseData.data,
      res
    );
  } catch (error) {
    // Closing Logs
    console.log(LOGGER_MESSAGES.ADDRESSES_FETCH_FAILED);
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
// Delete Address - /api/bytestation/v1/delete/address
exports.deleteAddress = async (req, res, next) => {
  try {
    // Initiating Logs
    console.log(LOGGER_MESSAGES.ADDRESS_DELETE);
    // Query Data
    const { address_id } = req.query;
    // Checking required fields
    if (!address_id) {
      throw new CustomError(CLIENT_MESSAGES.ERROR_MESSAGES.EMPTY_FIELD_ERROR);
    }
    // Response from the Service
    const responseData = await AddressServiceInstance.deleteAddress(
      address_id,
      req
    );
    // Closing Logs
    console.log(LOGGER_MESSAGES.ADDRESS_DELETE_COMPLETED);
    // Sending Response to Client
    RESPONSE.handleSuccessResponse(
      HTTP_STATUS_CODES.OK,
      responseData.message,
      responseData.data,
      res
    );
  } catch (error) {
    // Closing Logs
    console.log(LOGGER_MESSAGES.ADDRESS_DELETE_FAILED);
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
