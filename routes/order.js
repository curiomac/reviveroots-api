const express = require("express");
const router = express.Router();
const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/authenticate");
const { headerVerification } = require("../middlewares/headerVerification");
const {
  getOrderDetails,
  createOrder,
  getOrder,
  getOrders,
  getAllOrders,
} = require("../controllers/orderController");
const { API_ROUTES, ROLES } = require("../utils/appConstants");

router
  .route(API_ROUTES.ORDER_DETAILS.GET)
  .get(headerVerification, isAuthenticatedUser, getOrderDetails);
router
  .route("/create/order")
  .post(headerVerification, isAuthenticatedUser, createOrder);
router
  .route("/get/order")
  .get(headerVerification, isAuthenticatedUser, getOrder);
router
  .route("/get/orders")
  .get(headerVerification, isAuthenticatedUser, getOrders);
router
  .route("/get/all/orders")
  .get(
    headerVerification,
    isAuthenticatedUser,
    authorizeRoles(
      ROLES.SUPERVISOR,
      ROLES.MANAGER,
      ROLES.ADMIN,
      ROLES.SUPREME_ADMIN
    ),
    getAllOrders
  );

module.exports = router;
