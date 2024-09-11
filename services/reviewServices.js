// ProductService.js
const CLIENT_MESSAGES = require("../utils/clientResponseConstants");
const CustomError = require("../helpers/customError");
const Review = require("../models/reviewModel");
const Product = require("../models/productModel");
const { userModel: UserModel } = require("../models/userModel");
const { getRandomColor } = require("../utils/getRandomColor");

const ReviewService = () => {
  /**
   * Review Creating
   */
  const createReview = async (reviewData, req) => {
    try {
      const {
        productId,
        ratingValue,
        reviewTitle,
        reviewDetails,
        purchasedSize,
      } = reviewData;

      const user = req.user;

      // Verifying User
      if (!user) {
        throw new CustomError(CLIENT_MESSAGES.ERROR_MESSAGES.USER_NOT_FOUND);
      }
      // Verifying Product
      const product = await Product.findOne({ _id: productId });
      if (!product) {
        throw new CustomError(CLIENT_MESSAGES.ERROR_MESSAGES.PRODUCT_NOT_FOUND);
      }
      // Verifying Product already reviwed
      if (
        product.reviewedUsers.some(
          (data) => data?.userId?.toString() === user?._id?.toString()
        )
      ) {
        throw new CustomError(
          CLIENT_MESSAGES.ERROR_MESSAGES.PRODUCT_ALREADY_RATED
        );
      }
      // Handling Review Images
      let reviewImages = [];
      if (req?.files?.length > 0) {
        // Pushing Review Images to images Array
        req.files.forEach((file) => {
          let url = `${process.env.SERVER_URL}/uploads/review/${file.originalname}`;
          reviewImages.push({ url });
        });
      }
      const checkIsVerifiedUser = () => {
        if (
          product.verifiedPurchaseUsers.some(
            (data) => data?.userId?.toString() === user?._id?.toString()
          )
        ) {
          return "true";
        } else {
          return "false";
        }
      };
      const formattedReviewData = {
        userId: user?._id,
        ratingValue,
        reviewTitle,
        reviewDetails,
        reviewImages,
        ...(purchasedSize && { purchasedSize }),
        iconColor: getRandomColor(),
        isVerifiedPurchasedUser: checkIsVerifiedUser(),
      };

      const reviewFound = await Review.findOne({ productId });
      let review = {};

      if (reviewFound) {
        // Updating existing review document by adding new review data
        review = await Review.findOneAndUpdate(
          { productId: product?._id },
          { $addToSet: { reviewsList: formattedReviewData } },
          { new: true }
        );
      } else {
        // Creating a new review document
        review = await Review.create({
          productId,
          reviewsList: [formattedReviewData],
        });
      }
      if (review) {
        await Product.findOneAndUpdate(
          { _id: productId },
          {
            $push: { reviewedUsers: { userId: user?._id } },
          }
        );
      }

      // Returning Client Response to Controller
      return {
        data: {
          review,
        },
        message: CLIENT_MESSAGES.SUCCESS_MESSAGES.REVIEW_CREATION_SUCCESSFUL,
      };
    } catch (error) {
      throw new CustomError(error.message);
    }
  };
  /**
   * Review Updating
   */
  const updateReview = async (reviewData, req) => {
    try {
      const {
        productId,
        ratingValue,
        reviewTitle,
        reviewDetails,
        purchasedSize,
        reviewImages,
      } = reviewData;
      console.log("reviewData: ", reviewData);

      const user = req.user;

      // Verifying User
      if (!user) {
        throw new CustomError(CLIENT_MESSAGES.ERROR_MESSAGES.USER_NOT_FOUND);
      }
      // Verifying Product
      const product = await Product.findOne({ _id: productId });
      if (!product) {
        throw new CustomError(CLIENT_MESSAGES.ERROR_MESSAGES.PRODUCT_NOT_FOUND);
      }
      // Verifying Product
      const foundReview = await Review.findOne({ productId: product?._id });
      const foundReviewImages = foundReview.reviewsList.find(
        (data) => data.userId.toString() === user?._id.toString()
      );
      if (!foundReview) {
        throw new CustomError(CLIENT_MESSAGES.ERROR_MESSAGES.REVIEW_NOT_FOUND);
      }
      // Handling Product Images
      let reviewImagesArray = [];
      if (req.files?.length > 0) {
        req.files.forEach((file) => {
          let url = `${process.env.SERVER_URL}/uploads/review/${file.originalname}`;
          reviewImagesArray.push({ url });
        });
      }
      console.log(
        "reviewImagesArray: ",
        reviewImagesArray,
        "::",
        foundReviewImages
      );

      const reviewImagesUpdated = foundReviewImages?.reviewImages.filter(
        (image) =>
          JSON.parse(reviewImages).some(
            (data) => data._id === image._id.toString()
          )
      );

      reviewImagesArray = [...reviewImagesUpdated, ...reviewImagesArray];
      const checkIsVerifiedUser = () => {
        if (
          product.verifiedPurchaseUsers.some(
            (data) => data?.userId?.toString() === user?._id?.toString()
          )
        ) {
          return "true";
        } else {
          return "false";
        }
      };
      const formattedReviewData = {
        userId: user?._id,
        ratingValue,
        reviewTitle,
        reviewDetails,
        reviewImages: reviewImagesArray,
        ...(purchasedSize && { purchasedSize }),
        iconColor: getRandomColor(),
        isVerifiedPurchasedUser: checkIsVerifiedUser(),
      };
      console.log("formattedReviewData: ", formattedReviewData);

      // Updating the review in the reviewList array
      const review = await Review.findOneAndUpdate(
        { productId: product?._id, "reviewsList.userId": user?._id },
        { $set: { "reviewsList.$": formattedReviewData } },
        { new: true }
      );

      // Returning Client Response to Controller
      return {
        data: {
          review,
        },
        message: CLIENT_MESSAGES.SUCCESS_MESSAGES.REVIEW_UPDATE_SUCCESSFUL,
      };
    } catch (error) {
      throw new CustomError(error.message);
    }
  };

  /**
   * Reviews Fetching
   */
  const getReviews = async (productId, req) => {
    try {
      const product = await Product.findById(productId);

      // Verifying Product
      if (!product) {
        throw new CustomError(CLIENT_MESSAGES.ERROR_MESSAGES.PRODUCT_NOT_FOUND);
      }

      const review = await Review.findOne({ productId: product?._id });

      // Verifying Review
      if (!review) {
        throw new CustomError(CLIENT_MESSAGES.ERROR_MESSAGES.REVIEW_NOT_FOUND);
      }

      const formattedReview = {
        ...review?._doc,
        reviewsList: await Promise.all(
          review.reviewsList.map(async (data) => {
            const user = await UserModel.findById(data?.userId);
            return {
              ...data?._doc,
              user,
            };
          })
        ),
      };

      // Returning Client Response to Controller
      return {
        data: {
          review: formattedReview,
        },
        message: CLIENT_MESSAGES.SUCCESS_MESSAGES.REVIEWS_FETCH_SUCCESSFUL,
      };
    } catch (error) {
      throw new CustomError(error.message);
    }
  };
  /**
   * Reviews Deleting
   */
  const deleteReview = async (productId, req) => {
    try {
      const user = req.user;
      // Verifying User
      if (!user) {
        throw new CustomError(CLIENT_MESSAGES.ERROR_MESSAGES.USER_NOT_FOUND);
      }
      // Verifying Product
      const product = await Product.findOne({ _id: productId });
      console.log("product: ", product);
      
      if (!product) {
        throw new CustomError(CLIENT_MESSAGES.ERROR_MESSAGES.PRODUCT_NOT_FOUND);
      }
      const review = await Review.findOne({ productId });

      // Verifying Review
      if (!review) {
        throw new CustomError(CLIENT_MESSAGES.ERROR_MESSAGES.REVIEW_NOT_FOUND);
      }
      // Verifying review in list
      if (
        !review.reviewsList.some(
          (data) => data.userId.toString() === user?._id?.toString()
        )
      ) {
        throw new CustomError(CLIENT_MESSAGES.ERROR_MESSAGES.REVIEW_NOT_FOUND);
      }
      const updatedReview = await Review.findOneAndUpdate(
        { productId },
        { $pull: { reviewsList: { userId: user?._id } } },
        { new: true }
      );

      // Returning Client Response to Controller
      return {
        data: {
          review: updatedReview,
        },
        message: CLIENT_MESSAGES.SUCCESS_MESSAGES.REVIEW_DELETE_SUCCESSFUL,
      };
    } catch (error) {
      throw new CustomError(error.message);
    }
  };

  /**
   * Returning Services to Controller
   */
  return {
    createReview,
    updateReview,
    getReviews,
    deleteReview,
  };
};

module.exports = ReviewService;
