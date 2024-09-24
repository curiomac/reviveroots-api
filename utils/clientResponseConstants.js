const CLIENT_MESSAGES = {
  SUCCESS_MESSAGES: {
    PRODUCT_CREATION_SUCCESSFUL: "Product created successfully.",
    PRODUCT_UPDATE_SUCCESSFUL: "Product updated successfully.",
    PRODUCTS_FETCH_SUCCESSFUL: "Products fetched successfully.",
    CATEGORY_PRODUCTS_FETCH_SUCCESSFUL:
      "Category Products fetched successfully.",
    RECENT_PRODUCTS_FETCH_SUCCESSFUL: "Recent Products fetched successfully.",
    SIMILAR_PRODUCTS_FETCH_SUCCESSFUL: "Similar Products fetched successfully.",
    POPULAR_PRODUCTS_FETCH_SUCCESSFUL: "Popular Products fetched successfully.",
    RECOMMENDED_PRODUCTS_FETCH_SUCCESSFUL: "Recommended Products fetched successfully.",
    PRODUCT_FETCH_SUCCESSFUL: "Product fetched successfully.",
    ORDER_DETAILS_FETCH_SUCCESSFUL: "Order details fetched successfully.",
    ORDERS_FETCH_SUCCESSFUL: "Orders fetched successfully.",
    ORDER_CREATION_SUCCESSFUL: "Order placed successfully.",
    TEST_QUESTIONS_CREATION_SUCCESSFUL: "Test Questions created successfully.",
    TEST_QUESTIONS_FETCH_SUCCESSFUL: "Test Questions fetched successfully.",
    ADDRESS_CREATION_SUCCESSFUL: "Address created successfully.",
    ADDRESS_UPDATE_SUCCESSFUL: "Address updated successfully.",
    ADDRESSES_FETCH_SUCCESSFUL: "Addresses fetched successfully.",
    ADDRESS_DELETE_SUCCESSFUL: "Address deleted successfully.",
    REVIEW_CREATION_SUCCESSFUL:
      "Your review has been added successfully. We sincerely appreciate your valuable feedback!.",
    REVIEW_UPDATE_SUCCESSFUL: "Review updated successfully.",
    REVIEWS_FETCH_SUCCESSFUL: "Reviews fetched successfully.",
    REVIEW_DELETE_SUCCESSFUL: "Review deleted successfully.",
    PRODUCT_DELETE_SUCCESSFUL: "Product deleted successfully.",
    LOGIN_SUCCESSFUL: "Logged in successfully.",
    REGISTERATION_SUCCESSFUL: "Registered successfully.",
    PROFILE_FETCHED_SUCCESSFUL: "Profile fetched successfully.",
    PROFILE_UPDATED_SUCCESSFUL: "Profile updated successfully.",
    ADD_TO_CART_SUCCESSFUL:
      "Item added to the cart and ready for checkout whenever you're ready.",
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
    PRODUCT_UPDATE_FAILED: "Product updating failed.",
    PRODUCTS_FETCH_FAILED: "Products fetching failed.",
    PRODUCT_FETCH_FAILED: "Product fetching failed.",
    ORDER_DETAILS_FETCH_FAILED: "Order details fetching failed.",
    ORDER_CREATION_FAILED: "Order creation failed.",
    PRODUCT_NOT_FOUND:
      "Product not found. Please verify the entered Product Id or contact support for assistance.",
    PRODUCT_ALREADY_RATED:
      "Product has already been rated or the review has been removed. Please contact support for assistance.",
    ADDRESS_NOT_FOUND:
      "Address not found. Please verify the entered Product Id or contact support for assistance.",
    REVIEW_NOT_FOUND:
      "Review not found. Please verify the entered Product Id or contact support for assistance.",
    ORDER_NOT_FOUND:
      "Order not found. Please verify the entered Product Id or contact support for assistance.",
    ORDERS_NOT_FOUND:
      "Orders not found. Please verify the entered Product Id or contact support for assistance.",
    USER_REGISTERAION_FAILED: "User registeration failed.",
    LOGIN_FAILED: "User login failed.",
    EMPTY_FIELD_ERROR: "Please provide all the required fields.",
    DATE_BEFORE_CURRENT_DATE:
      "The selected date must not be before the current date.",
    MAX_QUANTITY_GREATER_AVAILABLE_QUANTITY:
      "Max Quantity must not be greater thaan the Available Quantity.",
    PRODUCT_ALREADY_IN_CART: "Product is already in the cart.",
    PRODUCT_NOT_IN_CART: "Product is not found in the cart.",
    CART_NOT_FOUND:
      "Cart not found. Please verify the entered Id or contact support for assistance.",
  },
};

module.exports = CLIENT_MESSAGES;
