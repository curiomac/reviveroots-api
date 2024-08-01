const CLIENT_MESSAGES = {
  SUCCESS_MESSAGES: {
    PRODUCT_CREATION_SUCCESSFUL: "Product created successfully.",
    PRODUCTS_FETCHED_SUCCESSFUL: "Product fetched successfully.",
  },
  ERROR_MESSAGES: {
    INTERNAL_SERVER_ERROR: "Internal Server Error",
    INVALID_X_VERIFY_TOKEN: "Invalid verification token",
    EMPTY_TOKEN:
      "Authentication token is missing. Please provide a valid token.",
    UNAUTHORIZED_USER:
      "Access denied. You are not authorized to perform this action.",
    INVALID_TOKEN:
      "Invalid token. Please provide a valid authentication token.",
    INVALID_EMAIL_OR_PASSWORD:
      "Invalid email or password. Please check your credentials and try again.",
    EXISTING_USER:
      "This email is already registered. Please choose a different email or sign in.",
    EMAIL_VERIFICATION_FAILED: "Email verification failed.",
    ALREADY_VERIFIED: "Your account has already been verified",
    USER_NOT_FOUND:
      "User not found. Please verify the entered Id or contact support for assistance.",
    EMAIL_VERIFY_PENDING:
      "Your email verification is pending. Please check your inbox for instructions.",
    INVALID_MOBILE:
      "Invalid phone number. Please check your phone number and try again.",
    URL_NOT_FOUND: "The requested resource could not be found on the server.",
    AUTHENTICATION_ERROR: "Login first to handle this resource",
    PRODUCT_CREATION_FAILED: "Product creation failed.",
    PRODUCTS_FETCH_FAILED: "Product fetching failed."
  },
};

module.exports = CLIENT_MESSAGES;
