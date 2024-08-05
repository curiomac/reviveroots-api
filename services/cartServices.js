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
      const { action, productId } = cartData;
      console.log("req.user: ", req.user);

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
      };

      const isCartFound = await Cart.findOne({ userId });

      const getCheckoutPrice = () => {
        let totalSalePrice = product?.salePrice;
        if (isCartFound) {
          const salePrices = isCartFound?.productsIdsInCart?.map(
            (data) =>
              Number(data?.currentSalePrice) *
              (Number(data?.quantity) +
                (action === "remove" &&
                productId.toString() === data.productId.toString()
                  ? -1
                  : productId.toString() === data.productId.toString()
                  ? 1
                  : 0))
          );
          totalSalePrice = salePrices?.reduce(
            (total, price) => total + price,
            0
          );
        }
        return totalSalePrice;
      };

      const formattedData = {
        cartProductData,
        checkoutPrice: getCheckoutPrice(),
      };
      let cart = {};
      if (isCartFound) {
        if (action === "remove") {
          const productInCart = isCartFound.productsIdsInCart.find(
            (item) => item.productId.toString() === productId.toString()
          );

          if (productInCart) {
            const afterReduced = Number(productInCart.quantity) - 1;
            if (afterReduced <= 0) {
              // Remove product from cart
              cart = await Cart.findOneAndUpdate(
                { userId },
                {
                  $pull: { productsIdsInCart: { productId: productId } },
                  $set: { checkoutPrice: formattedData.checkoutPrice },
                },
                { new: true, upsert: true }
              );
            } else {
              // Update product quantity in cart
              cart = await Cart.findOneAndUpdate(
                { userId, "productsIdsInCart.productId": productId },
                {
                  $set: {
                    "productsIdsInCart.$.quantity": afterReduced,
                    checkoutPrice: formattedData.checkoutPrice,
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
            const newQuantity = Number(productAlreadyInCart.quantity) + 1;
            cart = await Cart.findOneAndUpdate(
              { userId, "productsIdsInCart.productId": productId },
              {
                $set: {
                  "productsIdsInCart.$.quantity": newQuantity,
                  checkoutPrice: formattedData.checkoutPrice,
                },
              },
              { new: true, upsert: true }
            );
          } else {
            // Adding new product to cart
            cart = await Cart.findOneAndUpdate(
              { userId },
              {
                $addToSet: {
                  productsIdsInCart: cartProductData,
                },
                $set: { checkoutPrice: formattedData.checkoutPrice },
              },
              { new: true, upsert: true }
            );
          }
        }
      } else {
        // Creating cart in database
        cart = await Cart.create({
          userId,
          productsIdsInCart: [cartProductData],
          checkoutPrice: formattedData.checkoutPrice,
        });
      }

      // Returning client response to controller
      return {
        data: { cart },
        message: CLIENT_MESSAGES.SUCCESS_MESSAGES.ADD_TO_CART_SUCCESSFUL,
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
  };
};

module.exports = CartService;
