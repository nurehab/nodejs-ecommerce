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
} = require("../controller/user.controller");

const {
  validatorGetUser,
  validatorCreateUser,
  validatorUpdateUser,
  validatorDeleteUser,
  validatorchangeUserPassword,
} = require("../../../utils/validators/userValidator.rules");

const authService = require("../controller/Auth.user.controller");

app
  .route("/")
  .get(authService.protect, authService.allowedTo("manger", "admin"), getUsers)

  .post(
    authService.protect,
    authService.allowedTo("admin"),
    uploadUserImg,
    resizeImg,
    validatorCreateUser,
    createUser
  );

app.put(
  "/changePassword/:id",
  authService.protect,
  authService.allowedTo("user","admin","manger"),
  validatorchangeUserPassword,
  changeUserPassowrd
);

app
  .route("/:id")
  .get(
    authService.protect,
    authService.allowedTo("admin"),
    validatorGetUser,
    getUserById
  )

  .put(
    authService.protect,
    authService.allowedTo("admin"),
    uploadUserImg,
    resizeImg,
    validatorUpdateUser,
    updateUser
  )

  .delete(
    authService.protect,
    authService.allowedTo("admin"),
    validatorDeleteUser,
    deleteUser
  );

module.exports = app;
