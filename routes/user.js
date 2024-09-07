const express = require("express");
// const multer = require("multer");
// const path = require("path");
const {
  registerUser,
  loginUser,
  getProfile,
  sendSecretCode,
  updateProfile,
} = require("../controllers/userController");
const { headerVerification } = require("../middlewares/headerVerification");
const { isAuthenticatedUser } = require("../middlewares/authenticate");
const router = express.Router();
// const upload = multer({
//   storage: multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, path.join(__dirname, "..", "uploads/user"));
//     },
//     filename: function (req, file, cb) {
//       cb(null, file.originalname);
//     },
//   }),
// });

router.route("/send/secret_code").post(headerVerification, sendSecretCode);
router.route("/create/user").post(headerVerification, registerUser);
router.route("/login").post(headerVerification, loginUser);
router
  .route("/update/profile")
  .put(headerVerification, isAuthenticatedUser, updateProfile);
router
  .route("/get/profile")
  .get(headerVerification, isAuthenticatedUser, getProfile);

module.exports = router;
