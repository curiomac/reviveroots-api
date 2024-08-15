const express = require("express");
const router = express.Router();
const { isAuthenticatedUser } = require("../middlewares/authenticate");
const { headerVerification } = require("../middlewares/headerVerification");
const {
  getOrderDetails,
  createOrder,
  getOrder,
} = require("../controllers/orderController");
const { API_ROUTES } = require("../utils/appConstants");

router
  .route(API_ROUTES.ORDER_DETAILS.GET)
  .get(headerVerification, isAuthenticatedUser, getOrderDetails);
router
  .route("/create/order")
  .post(headerVerification, isAuthenticatedUser, createOrder);
router
  .route("/get/order")
  .get(headerVerification, isAuthenticatedUser, getOrder);

module.exports = router;
