const express = require("express");
const router = express.Router();
const {
  isAuthenticatedUser,
  authorizeRoles,
} = require("../middlewares/authenticate");
const { headerVerification } = require("../middlewares/headerVerification");
const { createProduct } = require("../controllers/productController");
const multer = require("multer");
const path = require("path");

const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, "..", "uploads/product"));
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    },
  }),
});

router
  .route("/create/product")
  .post(
    headerVerification,
    // isAuthenticatedUser,
    // authorizeRoles("admin", "manager"),
    upload.array("productImages"),
    createProduct
  );

module.exports = router;
