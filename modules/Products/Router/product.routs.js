const app = require("express").Router();

const {
  createProduct,
  getProduct,
  getProducts,
  updateProuct,
  deleteProduct,
  uploadImagesProduct,
  resizeImageProduct,
} = require("../Controller/product.controller");

const {
  validatorCreateProduct,
  validatorDeleteProduct,
  validatorGetProduct,
  validatorUpdateProduct,
} = require("../../../utils/validators/productValidator.rules");

const authService = require("../../User/controller/Auth.user.controller");
const reviewRoute = require("../../Review/Routes/review.route")

// NESTED ROUTE ==> api/v1/product/productId/reviews
app.use("/:productId/reviews",reviewRoute)
app
  .route("/")
  .get(getProducts)
  .post(
    authService.protect,
    authService.allowedTo("manger", "admin"),
    uploadImagesProduct,
    resizeImageProduct,
    validatorCreateProduct,
    createProduct
  );
app
  .route("/:id")
  .get(validatorGetProduct, getProduct)
  .put(
    authService.protect,
    authService.allowedTo("manger", "admin"),
    uploadImagesProduct,
    resizeImageProduct,
    validatorUpdateProduct,
    updateProuct
  )
  .delete(
    authService.protect,
    authService.allowedTo("admin"),
    validatorDeleteProduct,
    deleteProduct
  );

module.exports = app;
