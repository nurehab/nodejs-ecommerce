// RULES
const { check } = require("express-validator");
const slugify = require("slugify");
const bcrypt = require("bcryptjs");
const validatorMiddleware = require("../../middlewares/validator.middleware");
const User = require("../../modules/User/Model/user.model");
const ApiError = require("../apiError");

exports.validatorGetUser = [
  check("id")
    .notEmpty()
    .withMessage("Should be found ID")
    .isMongoId()
    .withMessage("invalid User Id format"),
  validatorMiddleware,
];
exports.validatorCreateUser = [
  check("name")
    .notEmpty()
    .withMessage("User required")
    .isLength({ min: 3 })
    .withMessage("Too short user name")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),

  check("email")
    .notEmpty()
    .withMessage("Please enter a valid email")
    .isEmail()
    .withMessage("Invalid Email ")
    .custom(async (val) => {
      const user = await User.findOne({ email: val });
      if (user) {
        return Promise.reject(new ApiError("Email already is used", 400));
      }
    }),
  check("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("password must be at least 6 charcters")
    .custom((val, { req }) => {
      if (val !== req.body.passwordConfirm) {
        throw new Error("Password Confirm is incorrect");
      }
      return true;
    }),

  check("passwordConfirm")
    .notEmpty()
    .withMessage("Password Confirm is required"),

  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("Invalid phone number only acetpted EGY & SA phone numbers"),

  check("profileImg").optional(),

  check("role").optional(),
  validatorMiddleware,
];

exports.validatorUpdateUser = [
  check("id")
    .notEmpty()
    .withMessage("Shold be found ID")
    .isMongoId()
    .withMessage("invalid User Id format"),
  check("name").custom((val, { req }) => {
    req.body.slug = slugify(val);
    return true;
  }),
  check("email")
    .notEmpty()
    .withMessage("Please enter a valid email")
    .isEmail()
    .withMessage("Invalid Email ")
    .custom(async (val) => {
      const user = await User.findOne({ email: val });
      if (user) {
        return Promise.reject(new ApiError("Email already is used", 400));
      }
    }),

  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("Invalid phone number only acetpted EGY & SA phone numbers"),

  check("profileImg").optional(),

  check("role").optional(),

  validatorMiddleware,
];

exports.validatorchangeUserPassword = [
  check("id")
    .isMongoId()
    .withMessage("invalid User Id format")
    .notEmpty()
    .withMessage("Shold be found ID"),

  check("currentPassword")
    .notEmpty()
    .withMessage("you must enter Current Password"),

  check("passwordConfirm")
    .notEmpty()
    .withMessage("you must enter Password Confirm "),

  check("password")
    .notEmpty()
    .withMessage("you must enter New Password")
    .custom(async (val, { req }) => {
      // verify Current Password
      const { id } = req.params;
      const user = await User.findById(id);
      if (!user) {
        throw new Error("There is no ID For User");
      }
      const hashingPassword = user.password;
      const isCorrect = await bcrypt.compare(
        req.body.currentPassword,
        hashingPassword
      );
      if (!isCorrect) {
        throw new Error("Invalid Current Password");
      }
      // verify Confirm Password
      if (val !== req.body.passwordConfirm) {
        throw new Error("Password confirmation doesn't match");
      }
      return true;
    }),
  validatorMiddleware,
];

exports.validatorDeleteUser = [
  check("id")
    .notEmpty()
    .withMessage("Shold be found ID")
    .isMongoId()
    .withMessage("invalid User Id format"),
  validatorMiddleware,
];


exports.validatorUpdateUserLogged = [
  check("name").custom((val, { req }) => {
    req.body.slug = slugify(val);
    return true;
  }),
  check("email")
    .notEmpty()
    .withMessage("Please enter a valid email")
    .isEmail()
    .withMessage("Invalid Email ")
    .custom(async (val) => {
      const user = await User.findOne({ email: val });
      if (user) {
        return Promise.reject(new ApiError("Email already is used", 400));
      }
    }),

  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("Invalid phone number only acetpted EGY & SA phone numbers"),

  validatorMiddleware,
];
