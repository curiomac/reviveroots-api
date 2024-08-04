// CartService.js
const CLIENT_MESSAGES = require("../utils/clientResponseConstants");
const CustomError = require("../helpers/customError");
const Cart = require("../models/cartModel");
const Product = require("../models/productModel");
const {
    userModel: User
} = require("../models/userModel");

const CartService = () => {
    /**
     * Products Adding to Cart
     */
    const addToCart = async (cartData, req) => {
        try {
            // Cart Data recieved from controller
            const { userId, productsIdsInCart } = cartData;

            const user = await User.findById(userId);
            if (!user) {
                throw new CustomError(CLIENT_MESSAGES.ERROR_MESSAGES.USER_NOT_FOUND)
            }
            const products = await Promise.all(productsIdsInCart.map(async (data) => {
                const product = await Product.findById(data.productId)
                if (!product) {
                    throw new CustomError(CLIENT_MESSAGES.ERROR_MESSAGES.PRODUCT_NOT_FOUND)
                }
                return {
                    productName: {
                        type: String,
                        required: [true, "Please enter Product Name"],
                    },
                    alternateName: {
                        type: String,
                        required: [true, "Please enter Alternate Name"],
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
                        default: "0",
                    },
                    minimumQuantity: {
                        type: String,
                        default: "0",
                    },
                    maximumQuantity: {
                        type: String,
                        default: "0",
                    },
                    grossPrice: {
                        type: String,
                        default: "0",
                    },
                    isDiscountedProduct: {
                        type: String,
                        default: "false",
                    },
                    discountPercentage: {
                        type: String,
                    },
                    discountPrice: {
                        type: String,
                        default: "0",
                    },
                    salePrice: {
                        type: String,
                        default: "0",
                    },
                    createdAt: {
                        type: Date,
                        default: Date.now,
                    },
                    createdBy: {
                        type: mongoose.Schema.Types.ObjectId,
                    },
                    updatedAt: data.updatedAt,
                }
            }))

            // Creating cart to DataBase
            const cart = await Cart.create();

            // Returning Client Response to Controller
            return {
                data: cart,
                message: CLIENT_MESSAGES.SUCCESS_MESSAGES.PRODUCT_CREATION_SUCCESSFUL,
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
