const express = require("express");
const app = express();
const errorMiddleware = require("./middlewares/error");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");
const auth = require("./routes/auth");
const product = require("./routes/product");

const corsOptions = {
  origin: true,
  credentials: true,
  methods: ["GET", "POST", "PUT"],
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
// const BASE_URL = process.env.BASE_URL;
const BASE_URL = "/api/bytestation/v1";

app.use(BASE_URL, auth);
app.use(BASE_URL, product);

app.use(errorMiddleware);

module.exports = app;
