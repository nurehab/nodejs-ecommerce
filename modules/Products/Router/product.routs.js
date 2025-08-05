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

app
  .route("/")
  .get(getProducts)
  .post(
    uploadImagesProduct,
    resizeImageProduct,
    validatorCreateProduct,
    createProduct
  );
app
  .route("/:id")
  .get(validatorGetProduct, getProduct)
  .put(
    uploadImagesProduct,
    resizeImageProduct,
    validatorUpdateProduct,
    updateProuct
  )
  .delete(validatorDeleteProduct, deleteProduct);

module.exports = app;
