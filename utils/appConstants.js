const { chalk } = require("./chalk")

const MESSAGES = {
  PORT_LISTEN: chalk.magenta("Server is now running on port: "),
};

const ERROR_MESSAGES = {
  INTERNAL_SERVER_ERROR: "Internal Server Error",
  VALIDATION_ERROR: "Validation error.",
};

const COLLECTION_NAMES = {
  USER: "user",
  IDENTITY: "identity",
};

const PAYMENT_METHODS = {
  COD: "COD",
  UPI: "UPI",
  CARD: "CARD-PAYMENT",
};
const PAYMENT_STATUS = {
  PENDING: "pending",
};
const STATUS = {
  ACTIVE: "active",
  INACTIVE: "inActive",
  PENDING: "pending",
};
const SHIPMENT_STATUS = {
  PROCESSING: "processing",
  SHIPPED: "shipped",
  DELIVERED: "delivered",
};

const ROLES = {
  USER: "user",
  SUPERVISOR: "supervisor",
  MANAGER: "manager",
  ADMIN: "admin",
  SUPREME_ADMIN: "supreme_admin",
};

const DBCONNECTION = {
  SUCCESSFUL: chalk.green("Connected to MongoDB"),
  UNSUCCESSFUL: chalk.red("MongoDB connection error"),
  ERROR: chalk.red("MongoDB connection error"),
  RECONNECTED: chalk.yellow("Reconnected to MongoDB"),
  DISCONNECTED: chalk.yellow("MongoDB disconnected. Reconnecting..."),
};

const TOKEN = {
  PERFIX_TOKEN: "Bearer",
};

const API_ROUTES = {
  ORDER_DETAILS: {
    GET: "/get/order_details"
  },
}

module.exports = {
  ERROR_MESSAGES,
  MESSAGES,
  DBCONNECTION,
  COLLECTION_NAMES,
  STATUS,
  PAYMENT_METHODS,
  TOKEN,
  ROLES,
  PAYMENT_STATUS,
  API_ROUTES,
  SHIPMENT_STATUS
};
