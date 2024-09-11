const express = require("express");
const app = express();
const errorMiddleware = require("./middlewares/error");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");
const user = require("./routes/user");
const product = require("./routes/product");
const cart = require("./routes/cart");
const order = require("./routes/order");
const address = require("./routes/address");
const review = require("./routes/review");
const dotenv = require("dotenv");
dotenv.config({ path: "config/config.env" });

const corsOptions = {
  origin: true,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
};

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  next();
});
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const BASE_URL = process.env.BASE_URL;

app.use(BASE_URL, user);
app.use(BASE_URL, product);
app.use(BASE_URL, cart);
app.use(BASE_URL, order);
app.use(BASE_URL, address);
app.use(BASE_URL, review);

app.use(errorMiddleware);

module.exports = app;
