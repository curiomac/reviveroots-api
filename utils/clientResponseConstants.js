const CLIENT_MESSAGES = {
  SUCCESS_MESSAGES: {
    PRODUCT_CREATION_SUCCESSFUL: "Product created successfully.",
    PRODUCTS_FETCH_SUCCESSFUL: "Products fetched successfully.",
    PRODUCT_FETCH_SUCCESSFUL: "Product fetched successfully.",
    PRODUCT_DELETE_SUCCESSFUL: "Product deleted successfully.",
    LOGIN_SUCCESSFUL: "Logged in successfully.",
    REGISTERATION_SUCCESSFUL: "Registered successfully.",
    PROFILE_FETCHED_SUCCESSFUL: "Profile fetched successfully.",
    ADD_TO_CART_SUCCESSFUL: "Item added to the cart successfully.",
    CART_ITEMS_FETCH_SUCCESSFUL: "Cart items fetched successfully.",
    CODE_SENT_SUCCESSFUL:
      "Secret code sent successfully. Please check your inbox for instructions.",
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
    CODE_ALREADY_SENT:
      "Your secret code has already been sent. Please check your inbox and try again.",
    CODE_EXPIRED: "The code has expired or has already been used.",
    CODE_INVALID: "The code is invalid. Please check your inbox and try again.",
    USER_NOT_FOUND:
      "User not found. Please verify the entered Id or contact support for assistance.",
    EMAIL_VERIFY_PENDING:
      "Your email verification is pending. Please check your inbox for instructions.",
    INVALID_MOBILE:
      "Invalid phone number. Please check your phone number and try again.",
    URL_NOT_FOUND: "The requested resource could not be found on the server.",
    AUTHENTICATION_ERROR: "Login first to handle this resource",
    PRODUCT_CREATION_FAILED: "Product creation failed.",
    PRODUCTS_FETCH_FAILED: "Products fetching failed.",
    PRODUCT_FETCH_FAILED: "Product fetching failed.",
    PRODUCT_NOT_FOUND:
      "Product not found. Please verify the entered Product Id or contact support for assistance.",
    USER_REGISTERAION_FAILED: "User registeration failed.",
    LOGIN_FAILED: "User login failed.",
    EMPTY_FIELD_ERROR: "Please provide all the required fields.",
    DATE_BEFORE_CURRENT_DATE:
      "The selected date must not be before the current date.",
    MAX_QUANTITY_GREATER_AVAILABLE_QUANTITY:
      "Max Quantity must not be greater thaan the Available Quantity.",
    PRODUCT_ALREADY_IN_CART: "Product is already in the cart.",
    PRODUCT_NOT_IN_CART: "Product is not found in the cart.",
  },
};

module.exports = CLIENT_MESSAGES;
