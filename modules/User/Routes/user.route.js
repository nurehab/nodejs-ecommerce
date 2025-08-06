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

app
  .route("/")
  .get(getUsers)
  .post(uploadUserImg, resizeImg, validatorCreateUser, createUser);
  
  app.put("/changePassword/:id",validatorchangeUserPassword, changeUserPassowrd);
  
app
  .route("/:id")
  .get(validatorGetUser, getUserById)
  .put(uploadUserImg, resizeImg, validatorUpdateUser, updateUser)
  .delete(validatorDeleteUser, deleteUser);

module.exports = app;
