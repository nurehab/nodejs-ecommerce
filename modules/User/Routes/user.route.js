const app = require("express").Router();

const {
  createUser,
  getUserById,
  getUsers,
  updateUser,
  deleteUser,
  uploadUserImg,
  resizeImg,
  changeUserPassowrd,
  getUserLogged,
  changeUserPassowrdLogged,
  updateGetUserLogged,
  deactiveLoggedUser
} = require("../controller/user.controller");

const {
  validatorGetUser,
  validatorCreateUser,
  validatorUpdateUser,
  validatorDeleteUser,
  validatorchangeUserPassword,
  validatorUpdateUserLogged,
} = require("../../../utils/validators/userValidator.rules");

const authService = require("../controller/Auth.user.controller");

app.use(authService.protect);

// LOGGED USER
app.get("/getMe", getUserLogged, getUserById);
app.put(
  "/changeMyPassword",
  validatorchangeUserPassword,
  changeUserPassowrdLogged
);
app.put("/updatedMe", validatorUpdateUserLogged, updateGetUserLogged);
app.delete("/deactiveMe", deactiveLoggedUser);

// USER FOR (ADMIN)
app.use(authService.allowedTo("manger", "admin"));

app
  .route("/")
  .get(getUsers)

  .post(uploadUserImg, resizeImg, validatorCreateUser, createUser);

app.put("/changePassword/:id", validatorchangeUserPassword, changeUserPassowrd);

app
  .route("/:id")
  .get(validatorGetUser, getUserById)

  .put(uploadUserImg, resizeImg, validatorUpdateUser, updateUser)

  .delete(validatorDeleteUser, deleteUser);

module.exports = app;
