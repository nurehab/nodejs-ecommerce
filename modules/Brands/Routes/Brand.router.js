const app = require("express").Router();

const {
  createBrand,
  getBrandById,
  getBrands,
  updateBrand,
  deleteBrand,
  uploadBrandImg,
  resizeImg,
} = require("../Controller/brand.controller");

const {
  validatorGetBrand,
  validatorCreateBrand,
  validatorUpdateBrand,
  validatorDeleteBrand,
} = require("../../../utils/validators/brandValidator.rules");

const authService = require("../../User/controller/Auth.user.controller");

app
  .route("/")
  .get(getBrands)
  .post(
    authService.protect,
    authService.allowedTo("manger", "admin"),
    uploadBrandImg,
    resizeImg,
    validatorCreateBrand,
    createBrand
  );
app
  .route("/:id")
  .get(validatorGetBrand, getBrandById)
  .put(
    authService.protect,
    authService.allowedTo("manger", "admin"),
    uploadBrandImg,
    resizeImg,
    validatorUpdateBrand,
    updateBrand
  )
  .delete(
    authService.protect,
    authService.allowedTo("admin"),
    validatorDeleteBrand,
    deleteBrand
  );

module.exports = app;
