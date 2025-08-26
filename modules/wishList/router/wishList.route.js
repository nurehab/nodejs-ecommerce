const app = require("express").Router();

const authService = require("../../User/controller/Auth.user.controller");

const {
  addProductToWishList,
  deletProductToWishList,
  getloggedUserWishList
} = require("../controller/wishList.controller");

app.use(authService.protect, authService.allowedTo("user"));

// app.route ==> for chain

app.route("/").post(addProductToWishList).get(getloggedUserWishList);

app.delete("/:productId", deletProductToWishList);

module.exports = app;
