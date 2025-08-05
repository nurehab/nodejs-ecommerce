// mergeParms : Allow us two acces parameters on other Routers
// ex: we need to acess categoryId ely 3ayzen negeb meno el subCategory from Category Router
const app = require("express").Router({mergeParams:true});
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

app
  .route("/")
  .post(
    setCategoryIdInsteadOFbody,
    createSubCategoryValidator,
    createSubCategory
  )
  .get(createFilterObject, getSubCategories);
app
  .route("/:id")
  .get(getSubCategoryValidator, getSubCategory)
  .put(updateSubCategoryValidator, updateSubCategory)
  .delete(deleteSubCategoryValidator, deleteSubCategory);

module.exports = app;
