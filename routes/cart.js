const express = require("express");
const router = express.Router();
const {
  isAuthenticatedUser,
} = require("../middlewares/authenticate");
const { headerVerification } = require("../middlewares/headerVerification");
const { addToCart, getCartItems } = require("../controllers/cartController");

router.route("/add/cart").post(
  headerVerification,
  isAuthenticatedUser,
  addToCart
);
router.route("/get/cart").get(
  headerVerification,
  isAuthenticatedUser,
  getCartItems
);

module.exports = router;
