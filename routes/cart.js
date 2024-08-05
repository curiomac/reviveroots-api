const express = require("express");
const router = express.Router();
const {
  isAuthenticatedUser,
} = require("../middlewares/authenticate");
const { headerVerification } = require("../middlewares/headerVerification");
const { addToCart } = require("../controllers/cartController");

router.route("/add/cart").post(
  headerVerification,
  isAuthenticatedUser,
  addToCart
);

module.exports = router;
