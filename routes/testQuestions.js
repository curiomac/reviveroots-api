const express = require("express");
const router = express.Router();
const { isAuthenticatedUser } = require("../middlewares/authenticate");
const { headerVerification } = require("../middlewares/headerVerification");
const {
  createTestQuestions,
  getTestQuestions,
} = require("../controllers/testQuestionsController");

router
  .route("/create/testquestions")
  .post(headerVerification, isAuthenticatedUser, createTestQuestions);
router
  .route("/get/testquestions")
  .get(headerVerification, isAuthenticatedUser, getTestQuestions);

module.exports = router;
