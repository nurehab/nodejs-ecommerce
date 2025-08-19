const app = require("express").Router();

const {
  createReview,
  getReviews,
  getReviewById,
  updateReview,
  deleteReview,
} = require("../controller/review.controller");

// const {
//   validatorGetBrand,
//   validatorCreateBrand,
//   validatorUpdateBrand,
//   validatorDeleteBrand,
// } = require("../../../utils/validators/brandValidator.rules");

const authService = require("../../User/controller/Auth.user.controller");

app.use(authService.protect);
app
  .route("/")
  .get(getReviews)
  .post(authService.allowedTo("user"), createReview);
app
  .route("/:id")
  .get(getReviewById)
  .put(authService.allowedTo("user"), updateReview)
  .delete(authService.allowedTo("user", "admin", "manger"), deleteReview);

module.exports = app;
