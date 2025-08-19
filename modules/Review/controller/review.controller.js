const asynchandler = require("express-async-handler");

const factory = require("../../../utils/handlerFactory");
const Review = require("../Model/reviewModel");



const createReview = factory.createOne(Review);

const getReviews = factory.getAll(Review);

const getReviewById = factory.getOne(Review);

const updateReview = factory.updateOne(Review);

const deleteReview = factory.deleteOne(Review);

module.exports = {
  createReview,
  getReviews,
  getReviewById,
  updateReview,
  deleteReview,
};
