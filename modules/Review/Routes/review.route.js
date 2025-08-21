const app = require("express").Router({mergeParams:true});

const {
  createReview,
  getReviews,
  getReviewById,
  updateReview,
  deleteReview,
  createFilterObject,
  setProductIdInsteadOfBody,
} = require("../controller/review.controller");

const {
  validatorCreateReview,
  validatorUpdateReview,
  validatorDeleteReview,
} = require("../../../utils/validators/reviewValidator.rules");

const authService = require("../../User/controller/Auth.user.controller");

app.get("/",createFilterObject, getReviews);
app.get("/:id", createFilterObject, getReviewById);

app.use(authService.protect);

app
  .route("/")
  .post(authService.allowedTo("user"), validatorCreateReview,setProductIdInsteadOfBody, createReview);
app
  .route("/:id")
  .put(authService.allowedTo("user"), validatorUpdateReview, updateReview)
  .delete(
    authService.allowedTo("user", "admin", "manger"),
    validatorDeleteReview,
    deleteReview
  );

module.exports = app;
