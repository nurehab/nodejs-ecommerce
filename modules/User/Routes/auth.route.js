const app = require("express").Router();

const {
  signUp,
  login,
  forgotPassword,
  verifyResetpasswordCode,
  resetPassword
} = require("../controller/Auth.user.controller");

const {
  signUpValidator,
  loginValidator,
} = require("../../../utils/validators/authValidator");

app.post("/signup", signUpValidator, signUp);
app.post("/login", loginValidator, login);
app.post("/forgetPassword", forgotPassword);
app.post("/verifyRestPasswordCode", verifyResetpasswordCode);
app.put("/resetPassword", resetPassword);

module.exports = app;
