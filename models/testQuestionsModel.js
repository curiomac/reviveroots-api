const mongoose = require("mongoose");

const testQuestionsSchema = new mongoose.Schema({
  username: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  mobileNumber: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  email: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  age: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  gender: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  testQuestions: {
    type: Object,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

let model = mongoose.model("testQuestions", testQuestionsSchema);

module.exports = model;
