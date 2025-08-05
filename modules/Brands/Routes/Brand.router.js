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

app
  .route("/")
  .get(getBrands)
  .post(uploadBrandImg, resizeImg, validatorCreateBrand, createBrand);
app
  .route("/:id")
  .get(validatorGetBrand, getBrandById)
  .put(uploadBrandImg, resizeImg, validatorUpdateBrand, updateBrand)
  .delete(validatorDeleteBrand, deleteBrand);

module.exports = app;
