const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  productsIdsInCart: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
      quantity: {
        type: String,
        default: "1",
      },
      onAddSalePrice: {
        type: String,
        required: true,
      },
      currentSalePrice: {
        type: String,
        required: true,
      },
      isPriceChangesRecorded: {
        type: String,
        default: "false",
      },
    },
  ],
  isCouponCodeApplied: {
    type: String,
    default: "false",
  },
  isEligibleForFreeDelivery: {
    type: String,
    default: "false",
  },
  checkoutPrice: {
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
});

let model = mongoose.model("cart", cartSchema);

module.exports = model;
