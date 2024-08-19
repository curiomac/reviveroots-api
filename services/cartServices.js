// CartService.js
const CLIENT_MESSAGES = require("../utils/clientResponseConstants");
const CustomError = require("../helpers/customError");
const Cart = require("../models/cartModel");
const Product = require("../models/productModel");
const { userModel: User } = require("../models/userModel");

const CartService = () => {
  /**
   * Products Adding to Cart
   */
  const addToCart = async (cartData, req) => {
    try {
      // Cart Data received from controller
      const { action, productId, quantity } = cartData;

      const userId = req?.user?.id;

      const user = await User.findById(userId);
      if (!user) {
        throw new CustomError(CLIENT_MESSAGES.ERROR_MESSAGES.USER_NOT_FOUND);
      }

      const product = await Product.findById(productId);
      if (!product) {
        throw new CustomError(CLIENT_MESSAGES.ERROR_MESSAGES.PRODUCT_NOT_FOUND);
      }

      const cartProductData = {
        productId: product._id,
        onAddSalePrice: product.salePrice,
        currentSalePrice: product.salePrice,
        quantity: quantity ? quantity : 1,
      };

      const isCartFound = await Cart.findOne({ userId });

      let updatedCart = {};
      if (isCartFound) {
        if (action === "remove") {
          const productInCart = isCartFound.productsIdsInCart.find(
            (item) => item.productId.toString() === productId.toString()
          );

          if (productInCart) {
            const afterReduced = Number(productInCart.quantity) - 1;
            if (afterReduced <= 0) {
              // Remove product from cart
              updatedCart = await Cart.findOneAndUpdate(
                { userId },
                {
                  $pull: { productsIdsInCart: { productId: productId } },
                },
                { new: true, upsert: true }
              );
            } else {
              // Update product quantity in cart
              updatedCart = await Cart.findOneAndUpdate(
                { userId, "productsIdsInCart.productId": productId },
                {
                  $set: {
                    "productsIdsInCart.$.quantity": afterReduced,
                  },
                },
                { new: true, upsert: true }
              );
            }
          } else {
            throw new CustomError(
              CLIENT_MESSAGES.ERROR_MESSAGES.PRODUCT_NOT_IN_CART
            );
          }
        } else {
          const productAlreadyInCart = isCartFound.productsIdsInCart.find(
            (item) => item.productId.toString() === productId.toString()
          );

          if (productAlreadyInCart) {
            // Increment the quantity of the existing product
            const newQuantity =
              Number(productAlreadyInCart.quantity) + (quantity ? quantity : 1);
            updatedCart = await Cart.findOneAndUpdate(
              { userId, "productsIdsInCart.productId": productId },
              {
                $set: {
                  "productsIdsInCart.$.quantity": newQuantity,
                },
              },
              { new: true, upsert: true }
            );
          } else {
            // Adding new product to cart
            updatedCart = await Cart.findOneAndUpdate(
              { userId },
              {
                $addToSet: {
                  productsIdsInCart: cartProductData,
                },
              },
              { new: true, upsert: true }
            );
          }
        }
      } else {
        // Creating cart in database
        updatedCart = await Cart.create({
          userId,
          productsIdsInCart: [cartProductData],
        });
      }

      const getCheckoutPrice = () => {
        const salePrices = updatedCart?.productsIdsInCart?.map(
          (data) => Number(data?.currentSalePrice) * Number(data?.quantity)
        );
        let totalSalePrice = salePrices?.reduce(
          (total, price) => total + price,
          0
        );
        return totalSalePrice;
      };

      const cartValue = await Cart.findOneAndUpdate(
        { userId },
        {
          $set: {
            isEligibleForFreeDelivery: getCheckoutPrice() > 1000 ? true : false,
            checkoutPrice: getCheckoutPrice().toString(),
          },
        },
        { new: true, upsert: true }
      );
      const productsIdsInCart = await Promise.all(
        cartValue.productsIdsInCart.map(async (data) => {
          const product = await Product.findById(data.productId);
          if (!product) {
            throw new CustomError(
              CLIENT_MESSAGES.ERROR_MESSAGES.PRODUCT_NOT_FOUND
            );
          }
          return {
            ...data?._doc,
            productImages: product?.productImages,
            productName: product?.productName,
          };
        })
      ).then((result) => result.reverse());
      // Returning client response to controller
      return {
        data: { cart: { ...cartValue._doc, productsIdsInCart } },
        message: CLIENT_MESSAGES.SUCCESS_MESSAGES.ADD_TO_CART_SUCCESSFUL,
      };
    } catch (error) {
      throw new CustomError(error.message);
    }
  };

  /**
   * Cart Items Fetching
   */

  const getCartItems = async (req) => {
    try {
      const userId = req?.user?.id;
      const user = await User.findById(userId);
      if (!user) {
        throw new CustomError(CLIENT_MESSAGES.ERROR_MESSAGES.USER_NOT_FOUND);
      }

      const cartItems = await Cart.findOne({ userId });
      if (!cartItems) {
        // Returning client response to controller
        return {
          data: { cart: { userId, productsIdsInCart: [] } },
          message: CLIENT_MESSAGES.SUCCESS_MESSAGES.CART_ITEMS_FETCH_SUCCESSFUL,
        };
      }
      await Promise.all(
        cartItems.productsIdsInCart.map(async (data) => {
          const product = await Product.findById(data.productId);
          await Cart.findOneAndUpdate(
            { userId, "productsIdsInCart.productId": data.productId },
            {
              $set: {
                "productsIdsInCart.$.currentSalePrice": product?.salePrice,
                "productsIdsInCart.$.isPriceChangesRecorded":
                  data.onAddSalePrice === product?.salePrice ? "false" : "true",
              },
            },
            { new: true, upsert: true }
          );
          return;
        })
      );
      const updatedCart = await Cart.findOne({ userId });
      const getCheckoutPrice = () => {
        const salePrices = updatedCart?.productsIdsInCart?.map(
          (data) => Number(data?.currentSalePrice) * Number(data?.quantity)
        );
        let totalSalePrice = salePrices?.reduce(
          (total, price) => total + price,
          0
        );
        return totalSalePrice;
      };

      const cartValue = await Cart.findOneAndUpdate(
        { userId },
        {
          $set: {
            isEligibleForFreeDelivery: getCheckoutPrice() > 1000 ? true : false,
            checkoutPrice: getCheckoutPrice().toString(),
          },
        },
        { new: true, upsert: true }
      );

      const productsIdsInCart = await Promise.all(
        cartValue.productsIdsInCart.map(async (data) => {
          const product = await Product.findById(data.productId);
          if (!product) {
            throw new CustomError(
              CLIENT_MESSAGES.ERROR_MESSAGES.PRODUCT_NOT_FOUND
            );
          }
          return {
            ...data?._doc,
            productImages: product?.productImages,
            productName: product?.productName,
          };
        })
      ).then((result) => result.reverse());
      // Returning client response to controller
      return {
        data: { cart: { ...cartValue._doc, productsIdsInCart } },
        message: CLIENT_MESSAGES.SUCCESS_MESSAGES.CART_ITEMS_FETCH_SUCCESSFUL,
      };
    } catch (error) {
      throw new CustomError(error.message);
    }
  };
  /**
   * Checkout Details Fetching
   */

  const getDeliveryCharges = async (req) => {
    try {
      const userId = req?.user?.id;
      const user = await User.findById(userId);
      if (!user) {
        throw new CustomError(CLIENT_MESSAGES.ERROR_MESSAGES.USER_NOT_FOUND);
      }

      const cart = await Cart.findOne({ userId });
      if (!cart) {
        throw new CustomError(CLIENT_MESSAGES.ERROR_MESSAGES.CART_NOT_FOUND);
      }

      // Returning client response to controller
      return {
        data: {
          cart,
        },
        message: CLIENT_MESSAGES.SUCCESS_MESSAGES.CART_ITEMS_FETCH_SUCCESSFUL,
      };
    } catch (error) {
      throw new CustomError(error.message);
    }
  };

  /**
   * Returning Services to Controller
   */
  return {
    addToCart,
    getCartItems,
    getDeliveryCharges,
  };
};

module.exports = CartService;
