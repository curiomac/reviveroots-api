// ProductService.js
const CLIENT_MESSAGES = require("../utils/clientResponseConstants");
const CustomError = require("../helpers/customError");
const Product = require("../models/productModel");
const APIFeatures = require("../utils/apiFeatures");
const moment = require("moment");

const ProductService = () => {
  /**
   * Product Creation
   */
  const createProduct = async (productData, req) => {
    try {
      // Product Data recieved from controller
      let {
        unitPrice,
        profitPercentage,
        isDiscountedProduct,
        isAdditionalInfo,
        discountPercentage,
        discountStartDate,
        countryOfMade,
        manufacturer,
        availableQuantity,
        maximumQuantity,
      } = productData;      
      const user = req.user;
      if (!user) {
        throw new CustomError(CLIENT_MESSAGES.ERROR_MESSAGES.USER_NOT_FOUND);
      }
      // Verifing maximum quantity not greater than available qaunatity
      if (maximumQuantity > availableQuantity) {
        throw new CustomError(
          CLIENT_MESSAGES.ERROR_MESSAGES.MAX_QUANTITY_GREATER_AVAILABLE_QUANTITY
        );
      }
      // Formating gross price from unit price and profit percentage
      const formattedGrossPrice = () => {
        let grossPrice = 0;
        if (profitPercentage > 100) {
          profitPercentage = 100;
        }
        const profitMargin = Number(profitPercentage) / 100;
        const profitMarginPrice = Number(unitPrice) * Number(profitMargin);
        grossPrice = Number(profitMarginPrice) + Number(unitPrice);
        return grossPrice;
      };
      // Formating sale price discount percentage
      const formattedSalePrice = () => {
        let salePrice = 0;
        let discountPrice = 0;
        // Verifing is discounted product or not
        if (isDiscountedProduct) {
          if (discountPercentage > 100) {
            discountPercentage = 100;
          }
          const discountMargin = Number(discountPercentage) / 100;
          discountPrice =
            Number(formattedGrossPrice()) * Number(discountMargin);
          salePrice = Number(formattedGrossPrice()) - discountPrice;
        } else {
          salePrice = formattedGrossPrice();
        }
        return { salePrice, discountPrice };
      };
      // Verifing date is not before current date
      if (isDiscountedProduct) {
        const currentDate = new Date();
        if (moment(discountStartDate).isBefore(currentDate)) {
          throw new CustomError(
            CLIENT_MESSAGES.ERROR_MESSAGES.DATE_BEFORE_CURRENT_DATE
          );
        }
      }
      // Handling Product Images
      let productImages = [];
      if (req.files.length > 0) {
        // Pushing Product Images to images Array
        req.files.forEach((file) => {
          let url = `${process.env.SERVER_URL}/uploads/product/${file.originalname}`;
          productImages.push({ url });
        });
      }
      // Formating the products data after all validations
      const formattedProductData = {
        ...productData,
        productImages,
        grossPrice: formattedGrossPrice(),
        salePrice: formattedSalePrice().salePrice,
        discountPrice: formattedSalePrice().discountPrice,
        ...(isAdditionalInfo && { manufacturer }),
        ...(isAdditionalInfo && { countryOfMade }),
        createdBy: user?._id,
        updatedBy: user?._id
      };
      // Creating product to DataBase
      const product = await Product.create(formattedProductData);

      // Returning Client Response to Controller
      return {
        data: { product },
        message: CLIENT_MESSAGES.SUCCESS_MESSAGES.PRODUCT_CREATION_SUCCESSFUL,
      };
    } catch (error) {
      throw new CustomError(error.message);
    }
  };
  /**
   * Product Updating
   */
  const updateProduct = async (productData, req) => {
    try {
      // Product Data recieved from controller
      let {
        productId,
        unitPrice,
        profitPercentage,
        isDiscountedProduct,
        isAdditionalInfo,
        discountPercentage,
        discountStartDate,
        countryOfMade,
        manufacturer,
        availableQuantity,
        maximumQuantity,
        productImages,
      } = productData;
      const user = req.user;
      if (!user) {
        throw new CustomError(CLIENT_MESSAGES.ERROR_MESSAGES.USER_NOT_FOUND);
      }
      
      const productFound = await Product.findById(productId);
      if (!productFound) {
        throw new CustomError(CLIENT_MESSAGES.ERROR_MESSAGES.PRODUCT_NOT_FOUND);
      }
      // Verifing maximum quantity not greater than available qaunatity
      if (maximumQuantity > availableQuantity) {
        throw new CustomError(
          CLIENT_MESSAGES.ERROR_MESSAGES.MAX_QUANTITY_GREATER_AVAILABLE_QUANTITY
        );
      }
      // Formating gross price from unit price and profit percentage
      const formattedGrossPrice = () => {
        let grossPrice = 0;
        if (profitPercentage > 100) {
          profitPercentage = 100;
        }
        const profitMargin = Number(profitPercentage) / 100;
        const profitMarginPrice = Number(unitPrice) * Number(profitMargin);
        grossPrice = Number(profitMarginPrice) + Number(unitPrice);
        return grossPrice;
      };
      // Formating sale price discount percentage
      const formattedSalePrice = () => {
        let salePrice = 0;
        let discountPrice = 0;
        // Verifing is discounted product or not
        if (isDiscountedProduct) {
          if (discountPercentage > 100) {
            discountPercentage = 100;
          }
          const discountMargin = Number(discountPercentage) / 100;
          discountPrice =
            Number(formattedGrossPrice()) * Number(discountMargin);
          salePrice = Number(formattedGrossPrice()) - discountPrice;
        } else {
          salePrice = formattedGrossPrice();
        }
        return { salePrice, discountPrice };
      };
      // Verifing date is not before current date
      if (isDiscountedProduct) {
        const currentDate = new Date();
        if (moment(discountStartDate).isBefore(currentDate)) {
          throw new CustomError(
            CLIENT_MESSAGES.ERROR_MESSAGES.DATE_BEFORE_CURRENT_DATE
          );
        }
      }
      // Handling Product Images
      let productImagesArray = [];
      if (req.files.length > 0) {
        // Pushing Product Images to images Array
        req.files.forEach((file) => {
          let url = `${process.env.SERVER_URL}/uploads/product/${file.originalname}`;
          productImagesArray.push({ url });
        });
      }

      const productImagesUpdated = productFound.productImages.filter((image) =>
        JSON.parse(productImages).some(
          (data) => data._id === image._id.toString()
        )
      );

      productImagesArray = [...productImagesUpdated, ...productImagesArray];

      // Formating the products data after all validations
      const formattedProductData = {
        ...productData,
        productImages: productImagesArray,
        grossPrice: formattedGrossPrice(),
        salePrice: formattedSalePrice().salePrice,
        discountPrice: formattedSalePrice().discountPrice,
        ...(isAdditionalInfo && { manufacturer }),
        ...(isAdditionalInfo && { countryOfMade }),
        updatedBy: user?._id
      };
      // throw new CustomError('error.message');
      // Creating product to DataBase
      const product = await Product.findByIdAndUpdate(
        productId,
        formattedProductData,
        { new: true, upsert: true }
      );

      // Returning Client Response to Controller
      return {
        data: { product },
        message: CLIENT_MESSAGES.SUCCESS_MESSAGES.PRODUCT_UPDATE_SUCCESSFUL,
      };
    } catch (error) {
      throw new CustomError(error.message);
    }
  };
  /**
   * Products Fetching
   */
  const getProducts = async (req) => {
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
      const formattedProducts = await buildQuery().paginate(resPerPage).query;
      const products = await Promise.all(
        formattedProducts.map(async (data) => {
          const formatDate = () => {
            const date = new Date();
            date.setUTCHours(0, 0, 0, 0);
            return date.toISOString().split("T")[0] + "T00:00:00.000Z";
          };
          const currentDate = new Date(formatDate());
          const isDiscounted =
            moment(currentDate).isSameOrAfter(data.discountStartDate) &&
            moment(currentDate).isSameOrBefore(data.discountEndDate);
          const updatedData = await Product.findByIdAndUpdate(
            data._id,
            { isDiscountedProduct: isDiscounted },
            { new: true }
          );

          return updatedData;
        })
      );

      // Returning Client Response to Controller
      return {
        data: {
          products,
          currentPage,
          totalPages,
          productsCount,
        },
        message: CLIENT_MESSAGES.SUCCESS_MESSAGES.PRODUCTS_FETCH_SUCCESSFUL,
      };
    } catch (error) {
      throw new CustomError(error.message);
    }
  };
  /**
   * Single Product Fetching
   */
  const getProduct = async (productId, req) => {
    try {
      const formattedProduct = await Product.findById(productId);
      if (!formattedProduct) {
        throw new CustomError(CLIENT_MESSAGES.ERROR_MESSAGES.PRODUCT_NOT_FOUND);
      }
      const updatedProduct = async () => {
        const formatDate = () => {
          const date = new Date();
          date.setUTCHours(0, 0, 0, 0);
          return date.toISOString().split("T")[0] + "T00:00:00.000Z";
        };
        const currentDate = new Date(formatDate());
        const isDiscounted =
          moment(currentDate)?.isSameOrAfter(
            formattedProduct?.discountStartDate
          ) &&
          moment(currentDate)?.isSameOrBefore(
            formattedProduct?.discountEndDate
          );
        const updatedData = await Product.findByIdAndUpdate(
          formattedProduct?._id,
          { isDiscountedProduct: isDiscounted },
          { new: true }
        );

        return updatedData;
      };
      const product = await updatedProduct();

      // Returning Client Response to Controller
      return {
        data: {
          product,
        },
        message: CLIENT_MESSAGES.SUCCESS_MESSAGES.PRODUCT_FETCH_SUCCESSFUL,
      };
    } catch (error) {
      throw new CustomError(error.message);
    }
  };
  /**
   * Product Deleting
   */
  const deleteProduct = async (productId, req) => {
    try {
      const product = await Product.findById(productId);
      if (!product) {
        throw new CustomError(CLIENT_MESSAGES.ERROR_MESSAGES.PRODUCT_NOT_FOUND);
      }
      await Product.findByIdAndDelete(product._id);
      // Returning Client Response to Controller
      return {
        data: {},
        message: CLIENT_MESSAGES.SUCCESS_MESSAGES.PRODUCT_DELETE_SUCCESSFUL,
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
    updateProduct,
    getProducts,
    getProduct,
    deleteProduct,
  };
};

module.exports = ProductService;
