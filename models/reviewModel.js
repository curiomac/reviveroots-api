const mongoose = require("mongoose");

const reviewsSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  reviewsList: [
    {
      userId: {
        type: String,
        required: true,
      },
      ratingValue: {
        type: String,
        required: true,
      },
      reviewTitle: {
        type: String,
        required: true,
      },
      reviewDetails: {
        type: String,
        required: true,
      },
      reviewImages: [
        {
          url: {
            type: String,
            required: true,
          },
        },
      ],
      purchasedSize: {
        type: String,
      },
      isVerifiedPurchasedUser: {
        type: String,
        default: "false"
      },
      iconColor: {
        type: String,
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
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

let model = mongoose.model("reviews", reviewsSchema);

module.exports = model;
