const express = require("express");
const router = express.Router();
const {
  isAuthenticatedUser,
  authorizeRoles,
} = require("../middlewares/authenticate");
const { headerVerification } = require("../middlewares/headerVerification");
const {
  createProduct,
  getProducts,
  getProduct,
  deleteProduct,
  updateProduct,
  getCategoryProducts,
  getRecentProducts,
  getSimilarProducts,
} = require("../controllers/productController");
const multer = require("multer");
const path = require("path");
const { ROLES } = require("../utils/appConstants");

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
    isAuthenticatedUser,
    authorizeRoles(
      ROLES.SUPERVISOR,
      ROLES.MANAGER,
      ROLES.ADMIN,
      ROLES.SUPREME_ADMIN
    ),
    upload.array("productImages"),
    createProduct
  );
router
  .route("/update/product")
  .put(
    headerVerification,
    isAuthenticatedUser,
    authorizeRoles(
      ROLES.SUPERVISOR,
      ROLES.MANAGER,
      ROLES.ADMIN,
      ROLES.SUPREME_ADMIN
    ),
    upload.array("updateProductImages"),
    updateProduct
  );

router.route("/get/products").get(headerVerification, getProducts);
router
  .route("/get/category/products")
  .get(headerVerification, getCategoryProducts);
router.route("/get/recent/products").get(headerVerification, getRecentProducts);
router
  .route("/get/similar/products")
  .get(headerVerification, getSimilarProducts);
router.route("/get/product").get(headerVerification, getProduct);
router.route("/delete/product").delete(headerVerification, deleteProduct);

module.exports = router;
