const express = require("express");
const router = express.Router();
const { isAuthenticatedUser } = require("../middlewares/authenticate");
const { headerVerification } = require("../middlewares/headerVerification");
const {
  createAddress,
  getAddresses,
  deleteAddress,
  updateAddress,
} = require("../controllers/addressController");

router
  .route("/create/address")
  .post(headerVerification, isAuthenticatedUser, createAddress);
router
  .route("/update/address")
  .put(headerVerification, isAuthenticatedUser, updateAddress);
router
  .route("/get/addresses")
  .get(headerVerification, isAuthenticatedUser, getAddresses);
router
  .route("/delete/address")
  .delete(headerVerification, isAuthenticatedUser, deleteAddress);

module.exports = router;
