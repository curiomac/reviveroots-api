const express = require("express");
const multer = require("multer");
const path = require("path");
const { registerUser } = require("../controllers/authController");
const { headerVerification } = require("../middlewares/headerVerification");
const router = express.Router();
const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, "..", "uploads/user"));
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    },
  }),
});

router.route("/create/user").post(headerVerification, registerUser);

module.exports = router;
