// ProductService.js
const CLIENT_MESSAGES = require("../utils/clientResponseConstants");
const CustomError = require("../helpers/customError");
const Product = require("../models/productModel");
const APIFeatures = require("../utils/apiFeatures");

const ProductService = () => {
  /**
   * Product Creatioon
   */
  const createProduct = async (productData, req) => {
    try {
      // Handling Product Images
      let productImages = [];
      if (req.files.length > 0) {
        // Pushing Product Images to images Array
        req.files.forEach((file) => {
          let url = `${process.env.SERVER_URL}/uploads/product/${file.originalname}`;
          productImages.push({ url });
        });
      }
      console.log("productImages: ", req.files.length);
      // Creating product to DataBase
      const product = await Product.create({ ...productData, productImages });

      // Returning Client Response to Controller
      return {
        data: product,
        message: CLIENT_MESSAGES.SUCCESS_MESSAGES.PRODUCT_CREATION_SUCCESSFUL,
      };
    } catch (error) {
      throw new CustomError(error.message);
    }
  };
  const getProducts = async (productData, req) => {
    try {
      const resPerPage = req.query?.limit;
      let buildQuery = () => {
        return new APIFeatures(Product.find(), req.query).search().filter();
      };
      const filteredProductCount = await buildQuery().query.countDocuments({});
      const totalProductsCount = await Product.countDocuments({});
      let productsCount = totalProductsCount;
      if (filteredProductCount !== totalProductsCount) {
        productsCount = filteredProductCount;
      }
      const currentPage = parseInt(req.query.page);
      const totalPages =
        Math.ceil(productsCount / resPerPage) > 0
          ? Math.ceil(productsCount / resPerPage)
          : 1;
      const products = await buildQuery().paginate(resPerPage).query;
      // Returning Client Response to Controller
      return {
        data: { products, currentPage, totalPages, productsCount },
        message: CLIENT_MESSAGES.SUCCESS_MESSAGES.PRODUCTS_FETCHED_SUCCESSFUL,
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
    getProducts,
  };
};

module.exports = ProductService;
