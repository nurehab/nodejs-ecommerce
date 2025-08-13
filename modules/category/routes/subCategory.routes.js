// mergeParms : Allow us two acces parameters on other Routers
// ex: we need to acess categoryId ely 3ayzen negeb meno el subCategory from Category Router
const app = require("express").Router({ mergeParams: true });
const {
  createSubCategory,
  getSubCategories,
  getSubCategory,
  updateSubCategory,
  deleteSubCategory,
  setCategoryIdInsteadOFbody,
  createFilterObject,
} = require("../controller/subCategory.controller");
const {
  createSubCategoryValidator,
  getSubCategoryValidator,
  updateSubCategoryValidator,
  deleteSubCategoryValidator,
} = require("../../../utils/validators/subCategoryValidator");

const authService = require("../../User/controller/Auth.user.controller");

app
  .route("/")
  .post(
    authService.protect,
    authService.allowedTo("manger", "admin"),
    setCategoryIdInsteadOFbody,
    createSubCategoryValidator,
    createSubCategory
  )
  .get(createFilterObject, getSubCategories);
app
  .route("/:id")
  .get(getSubCategoryValidator, getSubCategory)
  .put(
    authService.protect,
    authService.allowedTo("manger", "admin"),
    updateSubCategoryValidator,
    updateSubCategory
  )
  .delete(
    authService.protect,
    authService.allowedTo("admin"),
    deleteSubCategoryValidator,
    deleteSubCategory
  );

module.exports = app;
