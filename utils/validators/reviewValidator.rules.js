// RULES
const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validator.middleware");
const Review = require("../../modules/Review/Model/reviewModel");

exports.validatorCreateReview = [
  check("title").optional(),
  check("ratings")
    .notEmpty()
    .withMessage("Rating is Required")
    .isFloat({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 and 5"),
  check("user")
    .isMongoId()
    .withMessage("Review must belong to user")
    .custom(async (val, { req }) => {
      if (val.toString() !== req.user._id.toString()) {
        throw new Error("You can only create reviews for yourself");
      }
      return true;
    }),
  check("product")
    .isMongoId()
    .withMessage("Review must belong to product")
    .custom(async (val, { req }) => {
      const review = await Review.findOne({
        user: req.user._id,
        product: val,
      });
      if (review) {
        throw new Error("you already created a review before");
      }
      return true;
    }),
  validatorMiddleware,
];

exports.validatorGetReview = [
  check("id")
    .notEmpty()
    .withMessage("Should be found ID")
    .isMongoId()
    .withMessage("invalid Review Id format"),
  validatorMiddleware,
];

exports.validatorUpdateReview = [
  check("id")
    .notEmpty()
    .withMessage("Should be found ID")
    .isMongoId()
    .withMessage("invalid Review Id format")
    .custom(async (val, { req }) => {
      const review = await Review.findById(val);
      if (!review) {
        throw new Error(`This review not found ${val} `);
      }
      if (review.user._id.toString() !== req.user._id.toString()) {
        throw new Error("You are can't update this review not to belong u");
      }
      return true;
    }),
  validatorMiddleware,
];

exports.validatorDeleteReview = [
  check("id")
    .notEmpty()
    .withMessage("Shold be found ID")
    .isMongoId()
    .withMessage("invalid Review Id format")
    .custom(async (val, { req }) => {
      if (req.user.role === "user") {
        const review = await Review.findById(val);
        if (!review) {
          throw new Error(`This review not found ${val} `);
        }
        if (review.user._id.toString() !== req.user._id.toString()) {
          throw new Error("You are can't delete this review not to belong u");
        }
        return true;
      }
    }),
  validatorMiddleware,
];
