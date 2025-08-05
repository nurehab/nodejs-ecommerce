// RULES
const { check } = require("express-validator");
const slugify = require("slugify");
const validatorMiddleware = require("../../middlewares/validator.middleware");

exports.validatorGetCategry = [
  check("id").isMongoId().withMessage("invalid Category Id format"),
  validatorMiddleware,
];
exports.validatorCreateCategry = [
  check("name")
    .notEmpty()
    .withMessage("Category required")
    .isLength({ min: 3 })
    .withMessage("Too short category name")
    .isLength({ max: 32 })
    .withMessage("Too Long category name")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddleware,
];

exports.validatorUpdateCategry = [
  check("id").isMongoId().withMessage("invalid Category Id format"),
  check("name").optional().custom((val, { req }) => {
    req.body.slug = slugify(val);
    return true;
  }),
  validatorMiddleware,
];

exports.validatorDeleteCategry = [
  check("id").isMongoId().withMessage("invalid Category Id format"),
  validatorMiddleware,
];
