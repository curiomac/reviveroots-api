// ProductService.js
const CLIENT_MESSAGES = require("../utils/clientResponseConstants");
const CustomError = require("../helpers/customError");
const TestQuestions = require("../models/testQuestionsModel");

const TestQuestionsService = () => {
  /**
   * Test Questions Creating
   */
  const createTestQuestions = async (testQuestionsData, req) => {
    try {
      const { userName, email, mobileNumber, age, gender, testQuestions } =
        testQuestionsData;

      const formattedTestQuestionsData = {
        userName,
        email,
        mobileNumber,
        age,
        gender,
        testQuestions,
      };
      // Creating a new testQuestions document
      testQuestions = await TestQuestions.create(formattedTestQuestionsData);

      // Returning Client Response to Controller
      return {
        data: {
          testQuestions,
        },
        message:
          CLIENT_MESSAGES.SUCCESS_MESSAGES.TEST_QUESTIONS_CREATION_SUCCESSFUL,
      };
    } catch (error) {
      throw new CustomError(error.message);
    }
  };

  /**
   * TestQuestionses Fetching
   */
  const getTestQuestionses = async (req) => {
    try {
      const user = req.user;

      // Verifying User
      if (!user) {
        throw new CustomError(CLIENT_MESSAGES.ERROR_MESSAGES.USER_NOT_FOUND);
      }

      const testQuestions = await TestQuestions.findOne({ userId: user?._id });

      // Verifying TestQuestions
      if (!testQuestions) {
        throw new CustomError(
          CLIENT_MESSAGES.ERROR_MESSAGES.TEST_QUESTIONS_NOT_FOUND
        );
      }

      // Returning Client Response to Controller
      return {
        data: {
          testQuestions,
        },
        message:
          CLIENT_MESSAGES.SUCCESS_MESSAGES.TEST_QUESTIONSES_FETCH_SUCCESSFUL,
      };
    } catch (error) {
      throw new CustomError(error.message);
    }
  };

  /**
   * Returning Services to Controller
   */
  return {
    createTestQuestions,
    getTestQuestionses,
  };
};

module.exports = TestQuestionsService;
