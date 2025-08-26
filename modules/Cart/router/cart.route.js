const app = require("express").Router()

const {
  addProductToCart,
  getCartToLoggedUser,
  removeItemForLoggedUser,
  deleteAllCartForLoggedUser,
  updateQuantityForItemInCart,
  applyCoupon,
} = require("../controller/cart.controller");
const authService = require("../../User/controller/Auth.user.controller")

app.use(authService.protect,authService.allowedTo("user"))
app.post("/",addProductToCart)
app.post("/applyCoupon", applyCoupon);
app.get("/",getCartToLoggedUser)
app.delete("/", deleteAllCartForLoggedUser);
app.delete("/:itemId", removeItemForLoggedUser);
app.put("/:itemId", updateQuantityForItemInCart);

module.exports = app