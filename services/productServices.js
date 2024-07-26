// ProductService.js
const CLIENT_MESSAGES = require("../utils/clientResponseConstants");
const CustomError = require("../helpers/customError");
const Product = require("../models/productModel");

const ProductService = () => {
  /**
   * Product Creatioon
   */
  const createProduct = async (productData, req) => {
    try {
      // Handling Product Images
      let images = [];
      if (req.files.length > 0) {
        // Pushing Product Images to images Array
        req.files.forEach((file) => {
          let url = `${process.env.SERVER_URL}/uploads/product/${file.originalname}`;
          images.push({ image: url });
        });
      }
      
      // Creating product to DataBase
      const product = await Product.create(productData);

      // Returning Client Response to Controller
      return {
        data: product,
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
    createProduct,
  };
};

module.exports = ProductService;
