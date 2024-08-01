const mongoose = require("mongoose");
const { STATUS } = require("../utils/appConstants");

const productSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: [true, "Please enter Product Name"],
  },
  alternateName: {
    type: String,
    required: [true, "Please enter Alternate Name"],
  },
  description: {
    type: String,
    required: [true, "Please enter the Description"],
  },
  subDescription: {
    type: String,
    required: [true, "Please enter the Sub Description"],
  },
  countryOfMade: {
    type: String,
    required: [true, "Please enter the Country of Made"],
  },
  manufacturer: {
    type: String,
    required: [true, "Please enter the Manufacturer"],
  },
  attributes: {
    weight: {
      type: String,
      // required: [true, "Please enter Weight of the Product"],
    },
  },
  productTags: {
    type: Array,
    required: [true, "Please provide Product Tags"],
  },
  productCategory: {
    type: String,
    required: [true, "Please provide a Product Category"],
  },
  productImages: [
    {
      url: {
        type: String,
        required: [true, "Please Provide Product Images"],
      },
    },
  ],
  availableQuantity: {
    type: String,
    default: "0"
  },
  minimumQuantity: {
    type: String,
    default: "0"
  },
  maximumQuantity: {
    type: String,
    default: "0"
  },
  unitPrice: {
    type: String,
    default: "0"
  },
  profitPercentage: {
    type: String,
    default: "0"
  },
  grossPrice: {
    type: String,
    default: "0"
  },
  isDiscountedProduct: {
    type: String,
    default: "false",
  },
  discountStartDate: {
    type: Date,
  },
  discountEndDate: {
    type: Date,
  },
  discountPercentage: {
    type: String,
  },
  salePrice: {
    type: String,
    default: "0"
  },
  deliveryWithinDistrict: {
    type: String,
    default: "0"
  },
  deliveryWithinState: {
    type: String,
    default: "0"
  },
  deliveryInterState: {
    type: String,
    default: "0"
  },
  isCashOnDeliveryAccepted: {
    type: String,
    default: "false"
  },
  productStatus: {
    type: String,
    enum: [STATUS.ACTIVE, STATUS.INACTIVE, STATUS.PENDING],
    default: "pending",
  },
  aggregateRating: {
    type: String,
    default: "0",
  },
  verifiedPurchasUsers: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "Please provide the User Id"],
      },
    },
  ],
  viewedUsers: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "Please provide the User Id"],
      },
    },
  ],
  isSimilarTo: [
    {
      productIds: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "Please provide the Product Id"],
      },
    },
  ],
  isRelatedTo: [
    {
      productIds: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "Please provide the Product Id"],
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

let model = mongoose.model("product", productSchema);

module.exports = model;
