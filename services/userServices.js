// UserService.js
const CLIENT_MESSAGES = require("../utils/clientResponseConstants");
const CustomError = require("../helpers/customError");
const {
  userModel: User,
  secretCodeModel: SecretCode,
} = require("../models/userModel");
const HandleResponse = require("../helpers/handleResponse");
const readHTMLTemplate = require("../utils/readHTMLTemplate");
const secretCodeGenerator = require("../utils/secretCodeGenerator");
const sendEmail = require("../utils/email");
const SECRET_CODE = secretCodeGenerator();
const path = require("path");
const moment = require("moment");
const { STATUS } = require("../utils/appConstants");

const UserService = () => {
  /**
   * Email Verification
   */
  const sendSecretCode = async (userData, req) => {
    try {
      const { email, authCode, reSendOTP } = userData;

      await SecretCode.deleteMany({ expirationTime: { $lt: new Date() } });
      // if (!email) {
      //   return next(new ErrorHandler("Please enter an email", 400));
      // }
      const user = await User.findOne({ email });
      if (!user && authCode === "0") {
        throw new CustomError(CLIENT_MESSAGES.ERROR_MESSAGES.USER_NOT_FOUND);
      }
      if (user && authCode === "1") {
        throw new CustomError(CLIENT_MESSAGES.ERROR_MESSAGES.EXISTING_USER);
      }
      if (reSendOTP) {
        await SecretCode.deleteOne({ email });
      }
      const codeFound = await SecretCode.findOne({ email });
      if (codeFound) {
        throw new CustomError(CLIENT_MESSAGES.ERROR_MESSAGES.CODE_ALREADY_SENT);
      }

      const verificationData = {
        email,
        secretCode: SECRET_CODE,
        authCode,
      };

      await SecretCode.create(verificationData);

      const htmlTemplate = readHTMLTemplate(
        path.join(__dirname, "..", "ui/secretCodeEmailTemplate.htm"),
        {
          greet:
            authCode === "0"
              ? "Great to see you again! Welcome back to Byte Station."
              : authCode === "1" && "We’re excited you’ve joined Byte Station.",
          secretCode: SECRET_CODE,
        }
      );
      sendEmail({
        email,
        subject: "Email verification",
        message: htmlTemplate,
      });
      console.log(`[SECTRET_CODE][${email}]: ${SECRET_CODE}`);

      // Update the user's status to ACTIVE since verification is successful
      // await findByIdAndUpdateUser({ _id: user_id }, { status: STATUS.ACTIVE });
      return { message: CLIENT_MESSAGES.SUCCESS_MESSAGES.CODE_SENT_SUCCESSFUL };
    } catch (error) {
      throw new CustomError(error.message);
    }
  };
  /**
   * User Creatioon
   */
  const registerUser = async (userData, req) => {
    try {
      const { email, secretCodeClient } = userData;
      const verificationData = await SecretCode.findOne({ email });

      if (!verificationData) {
        throw new CustomError(CLIENT_MESSAGES.ERROR_MESSAGES.CODE_INVALID);
      }
      console.log("verificationData: ", verificationData);
      if (verificationData.authCode !== "1") {
        throw new CustomError(CLIENT_MESSAGES.ERROR_MESSAGES.CODE_INVALID);
      }
      const expirationTime = moment(verificationData.expirationTime);
      const currentTime = moment(new Date());
      if (expirationTime.isBefore(currentTime)) {
        await SecretCode.deleteOne({ email });
        throw new CustomError(CLIENT_MESSAGES.ERROR_MESSAGES.CODE_EXPIRED);
      }
      if (verificationData.secretCode !== secretCodeClient) {
        throw new CustomError(CLIENT_MESSAGES.ERROR_MESSAGES.CODE_INVALID);
      }
      // Creating user to DataBase
      const user = await User.create({
        ...userData,
        userStatus: STATUS.ACTIVE,
      });
      await SecretCode.deleteOne({ email });

      // Returning Client Response to Controller
      return {
        data: user,
        message: CLIENT_MESSAGES.SUCCESS_MESSAGES.REGISTERATION_SUCCESSFUL,
      };
    } catch (error) {
      throw new CustomError(error.message);
    }
  };
  /*
   * User Login
   */
  const loginUser = async (loginCredentials, req) => {
    try {
      const { email, secretCodeClient } = loginCredentials;
      const verificationData = await SecretCode.findOne({ email });
      if (!verificationData) {
        throw new CustomError(CLIENT_MESSAGES.ERROR_MESSAGES.CODE_INVALID);
      }
      if (verificationData.authCode !== "0") {
        throw new CustomError(CLIENT_MESSAGES.ERROR_MESSAGES.CODE_INVALID);
      }
      const expirationTime = moment(verificationData.expirationTime);
      const currentTime = moment(new Date());
      if (expirationTime.isBefore(currentTime)) {
        await SecretCode.deleteOne({ email });
        throw new CustomError(CLIENT_MESSAGES.ERROR_MESSAGES.CODE_EXPIRED);
      }
      if (verificationData.secretCode !== secretCodeClient) {
        throw new CustomError(CLIENT_MESSAGES.ERROR_MESSAGES.CODE_INVALID);
      }

      // Creating user to DataBase
      const user = await User.findOne({ email });
      if (!user) {
        // Closing Logs
        throw new CustomError(CLIENT_MESSAGES.ERROR_MESSAGES.USER_NOT_FOUND);
      }

      await SecretCode.deleteOne({ email });

      // Returning Client Response to Controller
      return {
        data: user,
        message: CLIENT_MESSAGES.SUCCESS_MESSAGES.LOGIN_SUCCESSFUL,
      };
    } catch (error) {
      throw new CustomError(error.message);
    }
  };
  const getProfile = async (req) => {
    try {
      // Creating user to DataBase
      const user = await User.findById(req.user.id);

      if (!user) {
        // Closing Logs
        throw new CustomError(CLIENT_MESSAGES.ERROR_MESSAGES.USER_NOT_FOUND);
      }
      // Returning Client Response to Controller
      return {
        data: user,
        message: CLIENT_MESSAGES.SUCCESS_MESSAGES.PROFILE_FETCHED_SUCCESSFUL,
      };
    } catch (error) {
      throw new CustomError(error.message);
    }
  };
  /**
   * Returning Services to Controller
   */
  return {
    sendSecretCode,
    registerUser,
    loginUser,
    getProfile,
  };
};

module.exports = UserService;
