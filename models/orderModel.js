const mongoose = require("mongoose");
const {
  PAYMENT_METHODS,
  PAYMENT_STATUS,
  SHIPMENT_STATUS,
} = require("../utils/appConstants");

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  paymentInfo: {
    paymentMethod: {
      type: String,
      enum: [PAYMENT_METHODS.COD, PAYMENT_METHODS.UPI, PAYMENT_METHODS.CARD],
      default: PAYMENT_METHODS.COD,
    },
    paymentStatus: {
      type: String,
      default: PAYMENT_STATUS.PENDING,
    },
    transactionId: {
      type: String,
    },
  },
  shippingAddress: {
    email: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
    },
    postalCode: {
      type: String,
      required: true,
    },
    mobileNumber: {
      type: String,
      required: true,
    },
    addressLine1: {
      type: String,
      required: true,
    },
    addressLine2: {
      type: String,
    },
    location: {
      type: String,
      required: true,
    },
    district: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    shipmentStatus: {
      type: String,
      enum: [
        SHIPMENT_STATUS.PROCESSING,
        SHIPMENT_STATUS.SHIPPED,
        SHIPMENT_STATUS.DELIVERED,
      ],
      default: SHIPMENT_STATUS.PROCESSING,
    },
  },
  productsInOrder: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
      productName: {
        type: String,
        required: true,
      },
      productCategory: {
        type: String,
        required: true,
      },
      productImages: [
        {
          url: {
            type: String,
            required: true,
          },
        },
      ],
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
  orderSummary: {
    totalPrice: {
      type: String,
      required: true,
    },
    isCouponCodeApplied: {
      type: String,
      default: "false",
    },
    isEligibleForFreeDelivery: {
      type: String,
      default: "false",
    },
    shippingCharge: {
      type: String,
      required: true,
    },
    gstPrice: {
      type: String,
      required: true,
    },
    totalAmountToPay: {
      type: String,
      required: true,
    },
  },
  estimatedDeliveryOn: {
    type: Date,
    default: Date.now,
  },
  courierPartner: {
    type: String,
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

let model = mongoose.model("order", orderSchema);

module.exports = model;
