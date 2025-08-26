const app = require("express").Router();

const authService = require("../../User/controller/Auth.user.controller");

const {
  addAddress,
  deleteAddress,
  getAddressesForLoggedUser,
} = require("../controller/Address.controller");


app.use(authService.protect, authService.allowedTo("user"));

app.route("/").post(addAddress).get(getAddressesForLoggedUser);

app.delete("/:addressId", deleteAddress);

module.exports = app;
