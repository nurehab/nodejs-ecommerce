// RULES
const { check } = require("express-validator");
const slugify= require("slugify");
const validatorMiddleware = require("../../middlewares/validator.middleware");

exports.validatorGetBrand = [
  check("id")
    .notEmpty()
    .withMessage("Shold be found ID")
    .isMongoId()
    .withMessage("invalid Brand Id format"),
  validatorMiddleware,
];
exports.validatorCreateBrand = [
  check("name")
    .notEmpty()
    .withMessage("Brand required")
    .isLength({ min: 3 })
    .withMessage("Too short brand name")
    .isLength({ max: 32 })
    .withMessage("Too Long brand name"),
    check("name").custom((val, { req }) => {
    req.body.slug = slugify(val);
    return true;
  }),
  validatorMiddleware,
];

exports.validatorUpdateBrand = [
  check("id")
    .notEmpty()
    .withMessage("Shold be found ID")
    .isMongoId()
    .withMessage("invalid Brand Id format"),
  check("name").custom((val, { req }) => {
    req.body.slug = slugify(val);
    return true;
  }),
  validatorMiddleware,
];

exports.validatorDeleteBrand = [
  check("id")
    .notEmpty()
    .withMessage("Shold be found ID")
    .isMongoId()
    .withMessage("invalid Brand Id format"),
  validatorMiddleware,
];
