const express = require("express");
const router = express.Router();
const { isAuthenticatedUser } = require("../middlewares/authenticate");
const { headerVerification } = require("../middlewares/headerVerification");
const {
  createReview,
  getReviews,
  deleteReview,
  updateReview,
} = require("../controllers/reviewController");

const multer = require("multer");
const path = require("path");
const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, "..", "uploads/review"));
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    },
  }),
});

router
  .route("/create/review")
  .post(
    headerVerification,
    isAuthenticatedUser,
    upload.array("reviewImages"),
    createReview
  );
router
  .route("/update/review")
  .put(
    headerVerification,
    isAuthenticatedUser,
    upload.array("updateReviewImages"),
    updateReview
  );
router
  .route("/get/reviews")
  .get(headerVerification, getReviews);
router
  .route("/delete/review")
  .delete(headerVerification, isAuthenticatedUser, deleteReview);

module.exports = router;
