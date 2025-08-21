const asynchandler = require("express-async-handler");

const factory = require("../../../utils/handlerFactory");
const Review = require("../Model/reviewModel");



// create ==> Nested route about creating review through productId 
const setProductIdInsteadOfBody = (req,res,next) =>{
  if(!req.body.product){
    req.body.product = req.params.productId
  }
  next()
}

// get ==> Nested route through filteration
const createFilterObject = (req,res,next) =>{
  let filterObject = {}
  if(req.params.productId){
    filterObject = { product: req.params.productId };
  }
  req.filterObj = filterObject
  next();
}


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
  createFilterObject,
  setProductIdInsteadOfBody,
};
