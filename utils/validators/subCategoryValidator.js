const { check } = require("express-validator");
const slugify = require("slugify");
const validatorMiddleware = require("../../middlewares/validator.middleware");

exports.createSubCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("name is required")
    .isLength({ min: 2 })
    .withMessage("To short subCategory")
    .isLength({ max: 32 })
    .withMessage("To loooooong subCategory")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("Category")
    .notEmpty()
    .withMessage("subCategory must be belong (parent : Category)")
    .isMongoId()
    .withMessage("Invalid Id"),
  validatorMiddleware,
];

exports.getSubCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid ID_FORMAT for SUBCATEGORY"),
  validatorMiddleware,
];

exports.updateSubCategoryValidator = [
  check("id")
    .notEmpty()
    .withMessage("subCategory must be belong (parent : Category)")
    .isMongoId()
    .withMessage("Invalid ID_FORMAT for SUBCATEGORY"),
  check("name").custom((val, { req }) => {
    req.body.slug = slugify(val);
    return true;
  }),
  validatorMiddleware,
];

exports.deleteSubCategoryValidator = [
  check("id")
    .notEmpty()
    .withMessage("subCategory must be belong (parent : Category)")
    .isMongoId()
    .withMessage("Invalid ID_FORMAT for SUBCATEGORY"),
  validatorMiddleware,
];
