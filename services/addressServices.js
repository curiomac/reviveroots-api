// ProductService.js
const CLIENT_MESSAGES = require("../utils/clientResponseConstants");
const CustomError = require("../helpers/customError");
const Address = require("../models/addressModel");

const AddressService = () => {
  /**
   * Address Creating
   */
  const createAddress = async (addressData, req) => {
    try {
      const {
        addressName,
        firstName,
        lastName,
        postalCode,
        mobileNumber,
        addressLine1,
        addressLine2,
        location,
        district,
        state,
        country,
      } = addressData;

      const user = req.user;

      // Verifying User
      if (!user) {
        throw new CustomError(CLIENT_MESSAGES.ERROR_MESSAGES.USER_NOT_FOUND);
      }

      const formattedAddressData = {
        addressName,
        firstName,
        lastName,
        postalCode,
        mobileNumber,
        addressLine1,
        addressLine2,
        location,
        district,
        state,
        country,
      };

      const addressFound = await Address.findOne({ userId: user?._id });
      let address = {};

      if (addressFound) {
        // Updating existing address document by adding new address data
        address = await Address.findOneAndUpdate(
          { userId: user?._id },
          { $addToSet: { addressList: formattedAddressData } },
          { new: true }
        );
      } else {
        // Creating a new address document
        address = await Address.create({
          userId: user?._id,
          addressList: [formattedAddressData],
        });
      }

      // Returning Client Response to Controller
      return {
        data: {
          address,
        },
        message: CLIENT_MESSAGES.SUCCESS_MESSAGES.ADDRESS_CREATION_SUCCESSFUL,
      };
    } catch (error) {
      throw new CustomError(error.message);
    }
  };
  /**
   * Address Updating
   */
  const updateAddress = async (addressData, req) => {
    try {
      const {
        addressName,
        firstName,
        lastName,
        postalCode,
        mobileNumber,
        addressLine1,
        addressLine2,
        location,
        district,
        state,
        country,
        addressId,
      } = addressData;

      const user = req.user;

      // Verifying User
      if (!user) {
        throw new CustomError(CLIENT_MESSAGES.ERROR_MESSAGES.USER_NOT_FOUND);
      }

      const formattedAddressData = {
        addressName,
        firstName,
        lastName,
        postalCode,
        mobileNumber,
        addressLine1,
        addressLine2,
        location,
        district,
        state,
        country,
      };

      const addressFound = await Address.findOne({ userId: user?._id });
      // Verifying Address
      if (!addressFound) {
        throw new CustomError(CLIENT_MESSAGES.ERROR_MESSAGES.ADDRESS_NOT_FOUND);
      }
      // Verifying address in list
      if (
        !addressFound.addressList.some((addr) => addr._id.toString() === addressId)
      ) {
        throw new CustomError(CLIENT_MESSAGES.ERROR_MESSAGES.ADDRESS_NOT_FOUND);
      }
      // Updating the address in the addressList array
      const address = await Address.findOneAndUpdate(
        { userId: user?._id, "addressList._id": addressId },
        { $set: { "addressList.$": formattedAddressData } },
        { new: true }
      );

      // Returning Client Response to Controller
      return {
        data: {
          address,
        },
        message: CLIENT_MESSAGES.SUCCESS_MESSAGES.ADDRESS_UPDATE_SUCCESSFUL,
      };
    } catch (error) {
      throw new CustomError(error.message);
    }
  };

  /**
   * Addresses Fetching
   */
  const getAddresses = async (req) => {
    try {
      const user = req.user;

      // Verifying User
      if (!user) {
        throw new CustomError(CLIENT_MESSAGES.ERROR_MESSAGES.USER_NOT_FOUND);
      }

      const address = await Address.findOne({ userId: user?._id });

      // Verifying Address
      if (!address) {
        throw new CustomError(CLIENT_MESSAGES.ERROR_MESSAGES.ADDRESS_NOT_FOUND);
      }

      // Returning Client Response to Controller
      return {
        data: {
          address,
        },
        message: CLIENT_MESSAGES.SUCCESS_MESSAGES.ADDRESSES_FETCH_SUCCESSFUL,
      };
    } catch (error) {
      throw new CustomError(error.message);
    }
  };
  /**
   * Addresses Deleting
   */
  const deleteAddress = async (addressId, req) => {
    try {
      const user = req.user;
      // Verifying User
      if (!user) {
        throw new CustomError(CLIENT_MESSAGES.ERROR_MESSAGES.USER_NOT_FOUND);
      }

      const address = await Address.findOne({ userId: user?._id });

      // Verifying Address
      if (!address) {
        throw new CustomError(CLIENT_MESSAGES.ERROR_MESSAGES.ADDRESS_NOT_FOUND);
      }
      // Verifying address in list
      if (
        !address.addressList.some((addr) => addr._id.toString() === addressId)
      ) {
        throw new CustomError(CLIENT_MESSAGES.ERROR_MESSAGES.ADDRESS_NOT_FOUND);
      }
      const updatedAddress = await Address.findOneAndUpdate(
        { userId: user?._id },
        { $pull: { addressList: { _id: addressId } } },
        { new: true }
      );

      // Returning Client Response to Controller
      return {
        data: {
          address: updatedAddress,
        },
        message: CLIENT_MESSAGES.SUCCESS_MESSAGES.ADDRESS_DELETE_SUCCESSFUL,
      };
    } catch (error) {
      throw new CustomError(error.message);
    }
  };

  /**
   * Returning Services to Controller
   */
  return {
    createAddress,
    updateAddress,
    getAddresses,
    deleteAddress,
  };
};

module.exports = AddressService;
