const app = require("express").Router();

const {
  createCashOrder,
  getOrders,
  getspecificOrder,
  getOrderForLoggedUser,
  updatePayOrder,
  updateDeliverOrder,
  createCheckOutSession,
} = require("../controller/order.controller");

const AuthService = require("../../User/controller/Auth.user.controller");

app.use(AuthService.protect);

app.post("/:cartId", AuthService.allowedTo("user"), createCashOrder);
app.get("/:id", AuthService.allowedTo("user"), getspecificOrder);
app.get(
  "/checkout-session/:cartId",
  AuthService.allowedTo("user"),
  createCheckOutSession
);
app.put("/:id/pay", AuthService.allowedTo("admin", "manger"), updatePayOrder);
app.put(
  "/:id/deliverd",
  AuthService.allowedTo("admin", "manger"),
  updateDeliverOrder
);
app.get(
  "/",
  AuthService.allowedTo("user", "admin", "manager"),
  getOrderForLoggedUser,
  getOrders
);

module.exports = app;
