const app = require("express").Router();

const {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
  uploadCategories,
  resizeImg,
} = require("../controller/category.controller");
const {
  validatorCreateCategry,
  validatorGetCategry,
  validatorUpdateCategry,
  validatorDeleteCategry,
} = require("../../../utils/validators/categoryValidator.rules");

const subCategoryRoute = require("./subCategory.routes");

const authService = require("../../User/controller/Auth.user.controller");
//middleware

// app.get("/getCategories",getCategories)
// app.get("/getCategory/:id",getCategory)
// app.put("/updateCategory/:id",updateCategory)
// app.delete("/deleteCategory/:id",deleteCategory)
// app.post("/createCategory",createCategory)

app
  .route("/")
  .get(getCategories)
  .post(
    authService.protect,
    authService.allowedTo("manger", "admin"),
    uploadCategories,
    resizeImg,
    validatorCreateCategry,
    createCategory
  );
app.use("/:categoryId/subCategories", subCategoryRoute);

app
  .route("/:id")
  .get(validatorGetCategry, getCategory)
  .put(
    authService.protect,
    authService.allowedTo("manger", "admin"),
    uploadCategories,
    resizeImg,
    validatorUpdateCategry,
    updateCategory
  )
  .delete(
    authService.protect,
    authService.allowedTo("admin"),
    validatorDeleteCategry,
    deleteCategory
  );

module.exports = app;
