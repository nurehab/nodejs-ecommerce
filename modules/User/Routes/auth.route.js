const app = require("express").Router();

const { signUp, login } = require("../controller/Auth.user.controller");

const {
  signUpValidator,
  loginValidator,
} = require("../../../utils/validators/authValidator");

app.route("/signup").post(signUpValidator, signUp);
app.route("/login").post(loginValidator, login);

module.exports = app;
