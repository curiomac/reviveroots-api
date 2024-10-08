// ProductService.js
const CLIENT_MESSAGES = require("../utils/clientResponseConstants");
const CustomError = require("../helpers/customError");
const Cart = require("../models/cartModel");
const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const { default: axios } = require("axios");
const { API_ROUTES } = require("../utils/appConstants");
const crypto = require("../utils/crypto");
const { checkIsAdmin } = require("../utils/checkIsAdmin");

const OrderService = () => {
  /**
   * Order Details Fetching
   */
  const getOrderDetails = async (req) => {
    try {
      // Query Data
      const { postal_code: postalCode, location } = req.query;
      const user = req.user;
      // Verifing User
      if (!user) {
        throw new CustomError(CLIENT_MESSAGES.ERROR_MESSAGES.USER_NOT_FOUND);
      }
      // Finding Cart Items from User Id
      const cart = await Cart.findOne({ userId: user._id });
      // Verifing Cart
      if (!cart) {
        throw new CustomError(CLIENT_MESSAGES.ERROR_MESSAGES.CART_NOT_FOUND);
      }
      const updatedProductPrice = cart?.productsIdsInCart?.map((data) => {
        const gstPercentage = Number(process.env.GST_PERCENTAGE);
        const gstPrice = (data?.currentSalePrice * gstPercentage) / 100;
        const currentSalePriceWithGST =
          Number(data?.currentSalePrice) + gstPrice;

        return {
          ...data?._doc,
          currentSalePrice: currentSalePriceWithGST.toString(),
          currentSalePriceWithoutGST: data?.currentSalePrice.toString(),
          gstPrice: gstPrice?.toString(),
        };
      });
      const getPrice = ({ isGST }) => {
        const salePrices = updatedProductPrice?.map(
          (data) =>
            Number(
              isGST ? data?.currentSalePrice : data?.currentSalePriceWithoutGST
            ) * Number(data?.quantity)
        );
        const gstPrices = updatedProductPrice?.map(
          (data) => Number(isGST ? data?.gstPrice : 0) * Number(data?.quantity)
        );
        let gstPrice = gstPrices?.reduce((total, price) => total + price, 0);
        let totalSalePrice = salePrices?.reduce(
          (total, price) => total + price,
          0
        );
        return { totalSalePrice, gstPrice };
      };

      let DISCOUNT_DELIVERY_CHARGE = 5500; // temp

      const getDeliveryDistance = async () => {
        const response = await axios.get(
          `${process.env.POSTAL_ADDRESS_API}/${postalCode}`
        );
        const foundCity = response?.data[0]?.PostOffice?.find(
          (data) => data.Name === location
        );
        const findDeliveryRadius = () => {
          if (foundCity?.Division === process.env.DIVISIONAL) {
            return "deliveryWithinLocal";
          } else if (foundCity?.District === process.env.DISTRICT) {
            return "deliveryWithinDistrict";
          } else if (foundCity?.State === process.env.STATE) {
            return "deliveryWithinState";
          } else {
            return "deliveryInterState";
          }
        };
        return findDeliveryRadius();
      };
      const deliveryRadius = await getDeliveryDistance();

      const totalMRP = getPrice({ isGST: false }).totalSalePrice;
      const deliveryCharges = await Promise.all(
        cart?.productsIdsInCart.map(async (data) => {
          const product = await Product.findById(data.productId);
          return {
            deliveryCharge: Number(
              product[postalCode ? deliveryRadius : "deliveryWithinLocal"]
            ),
          };
        })
      );
      const getDeliveryCharge = () => {
        const { cost, discountedDeliveryCharge } = deliveryCharges.reduce(
          (acc, item) => {
            const charge = item.deliveryCharge;
            const max = acc.cost;
            const discountedCharge =
              totalMRP >= DISCOUNT_DELIVERY_CHARGE ? 0 : charge;
            return {
              cost: charge > max ? charge : max,
              discountedDeliveryCharge: discountedCharge,
            };
          },
          { cost: 0, discountedDeliveryCharge: 0 }
        );

        // Returning calculated charges
        return { cost, discountedDeliveryCharge };
      };

      const isEligibleForFreeDelivery =
        getPrice({ isGST: false }).totalSalePrice > DISCOUNT_DELIVERY_CHARGE
          ? true
          : false;

      const totalAmountToPay =
        getPrice({ isGST: true }).totalSalePrice +
        getDeliveryCharge().discountedDeliveryCharge;
      // Formatting Order Summary
      const formatedOrderSummary = {
        totalPrice: getPrice({ isGST: false }).totalSalePrice.toString(),
        shippingCharge: getDeliveryCharge().discountedDeliveryCharge.toString(),
        isEligibleForFreeDelivery: isEligibleForFreeDelivery.toString(),
        gstPrice: getPrice({ isGST: true }).gstPrice.toString(),
        totalAmountToPay: totalAmountToPay.toString(),
      };
      const productsInOrder = await Promise.all(
        updatedProductPrice.map(async (data) => {
          const product = await Product.findById(data.productId);
          if (!product) {
            throw new CustomError(
              CLIENT_MESSAGES.ERROR_MESSAGES.PRODUCT_NOT_FOUND
            );
          }
          return {
            ...data,
            productImages: product?.productImages,
            productName: product?.productName,
            productCategory: product?.productCategory,
          };
        })
      ).then((result) => result.reverse());
      // Formatting Response to Client
      const formatedResponse = {
        productsInOrder,
        orderSummary: formatedOrderSummary,
      };
      // Returning Client Response to Controller
      return {
        data: {
          orderDetails: formatedResponse,
        },
        message:
          CLIENT_MESSAGES.SUCCESS_MESSAGES.ORDER_DETAILS_FETCH_SUCCESSFUL,
      };
    } catch (error) {
      throw new CustomError(error.message);
    }
  };
  /**
   * Order Creating
   */
  const createOrder = async (orderData, req) => {
    try {
      const {
        email,
        firstName,
        lastName,
        postalCode,
        mobileNumber,
        addressLine1,
        addressLine2,
        location,
        district,
        state,
        country,
      } = orderData;
      const user = req.user;

      // Verifying User
      if (!user) {
        throw new CustomError(CLIENT_MESSAGES.ERROR_MESSAGES.USER_NOT_FOUND);
      }

      const getOrderDetails = async () => {
        try {
          const response = await axios.get(
            `${process.env.SERVER_URL}${process.env.BASE_URL}${API_ROUTES.ORDER_DETAILS.GET}?postal_code=${postalCode}&location=${location}`,
            {
              withCredentials: true,
              headers: {
                Authorization: req.headers.authorization,
                "x-verification-token": req.headers["x-verification-token"],
              },
            }
          );

          const decryptedData = crypto().decode(response?.data?.encryptedData)
            ?.data?.orderDetails;
          return decryptedData;
        } catch (error) {
          throw new CustomError(error.message);
        }
      };

      const orderDetailsResponse = await getOrderDetails();

      const formattedProductsInOrder =
        orderDetailsResponse?.productsInOrder?.map((data) => {
          return {
            productId: data?.productId,
            quantity: data?.quantity,
            onAddSalePrice: data?.onAddSalePrice,
            currentSalePrice: data?.currentSalePrice,
            isPriceChangesRecorded: data?.isPriceChangesRecorded,
            productImages: data?.productImages,
            productName: data?.productName,
            productCategory: data?.productCategory,
            selectedSize: data?.selectedSize,
          };
        });

      const formattedShippingAddress = {
        email,
        firstName,
        lastName,
        postalCode,
        mobileNumber,
        addressLine1,
        addressLine2,
        location,
        district,
        state,
        country,
      };

      const formattedOrderData = {
        userId: user.id,
        productsInOrder: formattedProductsInOrder,
        orderSummary: orderDetailsResponse?.orderSummary,
        shippingAddress: formattedShippingAddress,
      };

      const orderDetails = await Order.create(formattedOrderData);

      if (orderDetails) {
        for (const product of formattedProductsInOrder) {
          const foundProduct = await Product.findOne({
            _id: product.productId,
          });

          const currentAvailableQuantity = Number(
            foundProduct.availableQuantity
          );
          const orderedQuantity = Number(product.quantity);

          if (isNaN(currentAvailableQuantity) || isNaN(orderedQuantity)) {
            throw new CustomError(
              CLIENT_MESSAGES.ERROR_MESSAGES.INTERNAL_SERVER_ERROR
            );
          }

          const updatedAvailableQuantity =
            currentAvailableQuantity - orderedQuantity;

          await Product.findOneAndUpdate(
            { _id: product.productId },
            {
              availableQuantity: updatedAvailableQuantity.toString(),
              $push: {
                verifiedPurchaseUsers: {
                  userId: user?._id,
                  productId: product?.productId,
                  purchasedSize: product?.selectedSize,
                },
              },
            }
          );
        }

        await Cart.findOneAndDelete({ userId: user._id });
      }

      return {
        data: {
          orderDetails,
        },
        message:
          CLIENT_MESSAGES.SUCCESS_MESSAGES.ORDER_DETAILS_FETCH_SUCCESSFUL,
      };
    } catch (error) {
      throw new CustomError(error.message);
    }
  };

  /**
   * Single Order Fetching
   */
  const getOrder = async (orderId, req) => {
    try {
      const user = req.user;
      // Verifing User
      if (!user) {
        throw new CustomError(CLIENT_MESSAGES.ERROR_MESSAGES.USER_NOT_FOUND);
      }
      const isAdmin = checkIsAdmin(user?.role);
      const orderDetails = await Order.findOne({
        ...(!isAdmin && { userId: user.id }),
        _id: orderId,
      });
      // Verifing Order
      if (!orderDetails) {
        throw new CustomError(CLIENT_MESSAGES.ERROR_MESSAGES.ORDER_NOT_FOUND);
      }

      // Returning Client Response to Controller
      return {
        data: {
          orderDetails,
        },
        message:
          CLIENT_MESSAGES.SUCCESS_MESSAGES.ORDER_DETAILS_FETCH_SUCCESSFUL,
      };
    } catch (error) {
      throw new CustomError(error.message);
    }
  };
  /**
   * Orders Fetching
   */
  const getOrders = async (orderData, req) => {
    try {
      const user = req.user;
      const { keyword } = orderData;
      // Verifing User
      if (!user) {
        throw new CustomError(CLIENT_MESSAGES.ERROR_MESSAGES.USER_NOT_FOUND);
      }
      const ordersCount = await Order.countDocuments({
        userId: user.id,
      });
      const orders = await Order.find({
        userId: user.id,
        ...(keyword && { _id: { $regex: keyword, $options: "i" } }),
      });
      console.log("orders: ", ordersCount);

      // Verifing Order
      if (!orders) {
        throw new CustomError(CLIENT_MESSAGES.ERROR_MESSAGES.ORDERS_NOT_FOUND);
      }
      // Returning Client Response to Controller
      return {
        data: {
          orders,
          ordersCount,
        },
        message: CLIENT_MESSAGES.SUCCESS_MESSAGES.ORDERS_FETCH_SUCCESSFUL,
      };
    } catch (error) {
      throw new CustomError(error.message);
    }
  };
  /**
   * All Orders Fetching
   */
  const getAllOrders = async (req) => {
    try {
      const user = req.user;
      // Verifing User
      if (!user) {
        throw new CustomError(CLIENT_MESSAGES.ERROR_MESSAGES.USER_NOT_FOUND);
      }
      const orders = await Order.find();
      // Verifing Order
      if (!orders) {
        throw new CustomError(CLIENT_MESSAGES.ERROR_MESSAGES.ORDERS_NOT_FOUND);
      }
      // Returning Client Response to Controller
      return {
        data: {
          orders,
        },
        message: CLIENT_MESSAGES.SUCCESS_MESSAGES.ORDERS_FETCH_SUCCESSFUL,
      };
    } catch (error) {
      throw new CustomError(error.message);
    }
  };

  /**
   * Returning Services to Controller
   */
  return {
    getOrderDetails,
    createOrder,
    getOrder,
    getOrders,
    getAllOrders,
  };
};

module.exports = OrderService;
