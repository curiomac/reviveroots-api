// ProductService.js
const CLIENT_MESSAGES = require("../utils/clientResponseConstants");
const CustomError = require("../helpers/customError");
const Product = require("../models/productModel");
const APIFeatures = require("../utils/apiFeatures");
const moment = require("moment");

const ProductService = () => {
  /* Check is discounted product */
  const discountVerifiedProducts = async (products) =>
    await Promise.all(
      products.map(async (product) => {
        const formatDate = () => {
          const date = new Date();
          date.setUTCHours(0, 0, 0, 0);
          return date.toISOString().split("T")[0] + "T00:00:00.000Z";
        };
        const currentDate = new Date(formatDate());
        const isDiscounted =
          moment(currentDate).isSameOrAfter(product.discountStartDate) &&
          moment(currentDate).isSameOrBefore(product.discountEndDate);
        console.log("isDiscounted: ", isDiscounted);

        const updatedProduct = await Product.findByIdAndUpdate(
          product._id,
          {
            isDiscountedProduct: isDiscounted,
            salePrice: isDiscounted
              ? product.grossPrice - product.discountPrice
              : product.grossPrice,
          },
          { new: true }
        );
        return updatedProduct;
      })
    );

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
        productTags,
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
        productTags: JSON.parse(productTags),
        ...(isAdditionalInfo && { manufacturer }),
        ...(isAdditionalInfo && { countryOfMade }),
        createdBy: user?._id,
        updatedBy: user?._id,
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
        productTags,
        availableSizes,
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
        productTags: JSON.parse(productTags),
        availableSizes: JSON.parse(availableSizes),
        ...(isAdditionalInfo && { manufacturer }),
        ...(isAdditionalInfo && { countryOfMade }),
        updatedBy: user?._id,
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
      const products = await discountVerifiedProducts(formattedProducts);

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
   * Recent Products Fetching
   */
  const getRecentProducts = async (product_ids, req) => {
    try {
      console.log("product_idsasas: ", product_ids);

      // Fetching all products from their IDs in parallel
      const products = await Promise.all(
        JSON.parse(product_ids).map(async (productId) => {
          const foundProduct = await Product.findById(productId);
          if (foundProduct) {
            const currentDate = new Date();
            const isDiscounted =
              moment(currentDate).isSameOrAfter(
                foundProduct.discountStartDate
              ) &&
              moment(currentDate).isSameOrBefore(foundProduct.discountEndDate);
            const updatedProduct = await Product.findByIdAndUpdate(
              foundProduct._id,
              {
                isDiscountedProduct: isDiscounted,
                salePrice: isDiscounted
                  ? foundProduct.salePrice
                  : foundProduct.grossPrice,
              },
              { new: true }
            );

            return updatedProduct;
          }
          return null;
        })
      );

      const validProducts = products.filter((product) => product !== null);

      // Returning Client Response to Controller
      return {
        data: {
          products: validProducts,
        },
        message:
          CLIENT_MESSAGES.SUCCESS_MESSAGES.RECENT_PRODUCTS_FETCH_SUCCESSFUL,
      };
    } catch (error) {
      throw new CustomError(error.message);
    }
  };

  /**
   * Category Products Fetching
   */
  const getCategoryProducts = async (req) => {
    try {
      const products = await Product.aggregate([
        {
          $group: {
            _id: "$productCategory",
            products: { $push: "$$ROOT" },
          },
        },
        {
          $project: {
            productCategory: "$_id",
            products: { $slice: ["$products", 3] },
          },
        },
        { $unwind: "$products" },
        { $replaceRoot: { newRoot: "$products" } },
      ]);

      const updatedProducts = await discountVerifiedProducts(products);

      // Returning Client Response to Controller
      return {
        data: {
          products: updatedProducts,
        },
        message: CLIENT_MESSAGES.SUCCESS_MESSAGES.PRODUCTS_FETCH_SUCCESSFUL,
      };
    } catch (error) {
      throw new CustomError(error.message);
    }
  };
  /**
   * Similar Products Fetching
   */
  const getSimilarProducts = async (similarProductsQuery, req) => {
    try {
      const { productTags } = similarProductsQuery;

      // Fetch similar products using productTags for prioritization
      const similarProducts = await Product.aggregate([
        {
          $match: {
            productTags: { $in: JSON.parse(productTags) },
          },
        },
        {
          $addFields: {
            tagPriority: {
              $size: {
                $setIntersection: [JSON.parse(productTags), "$productTags"],
              },
            },
          },
        },
        {
          $sort: { tagPriority: -1 },
        },
        {
          $limit: 10,
        },
      ]);

      const updatedProducts = await discountVerifiedProducts(similarProducts);
      console.log("updatedProducts: ", updatedProducts);

      return {
        data: {
          products: updatedProducts,
        },
        message:
          CLIENT_MESSAGES.SUCCESS_MESSAGES.SIMILAR_PRODUCTS_FETCH_SUCCESSFUL,
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
          {
            isDiscountedProduct: isDiscounted,
            salePrice: isDiscounted
              ? formattedProduct.grossPrice - formattedProduct.discountPrice
              : formattedProduct.grossPrice,
          },
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
    getCategoryProducts,
    getRecentProducts,
    getSimilarProducts,
  };
};

module.exports = ProductService;
