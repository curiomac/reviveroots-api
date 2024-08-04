const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { STATUS, ROLES } = require("../utils/appConstants");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  mobileNumber: {
    type: String,
  },
  alternateMobileNumber: {
    type: String,
  },
  email: {
    type: String,
    required: [true, "Please enter email"],
    unique: true,
    validate: [validator.isEmail, "Please enter valid email address"],
  },
  avatar: {
    type: String,
  },
  role: {
    type: String,
    enum: [
      ROLES.USER,
      ROLES.SUPERVISOR,
      ROLES.MANAGER,
      ROLES.ADMIN,
      ROLES.SUPREME_ADMIN,
    ],
    default: ROLES.USER,
  },
  userStatus: {
    type: String,
    enum: [STATUS.ACTIVE, STATUS.INACTIVE, STATUS.PENDING],
    default: STATUS.PENDING,
  },
  resetPasswordToken: String,
  resetPasswordTokenExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const secretCodeSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  secretCode: {
    type: String,
    required: true,
  },
  authCode: {
    type: String,
    required: true,
  },
  expirationTime: {
    // Code will expire within 15 minutes from Date now
    type: Date,
    default: () => Date.now() + 15 * 60 * 1000,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_TIME,
  });
};

userSchema.methods.isValidPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.getResetToken = function () {
  // generate token
  const token = crypto.randomBytes(20).toString("hex");
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
  //set token expire time
  this.resetPasswordTokenExpire = Date.now() + 30 * 60 * 1000;
  return token;
};

let userModel = mongoose.model("User", userSchema);
let secretCodeModel = mongoose.model("SecretCode", secretCodeSchema);

module.exports = { userModel, secretCodeModel };
