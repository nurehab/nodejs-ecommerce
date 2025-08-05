const slugify = require("slugify");
const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validator.middleware");

exports.validatorGetProduct = [
  check("id")
    .notEmpty()
    .withMessage("Invalid Product Id Format")
    .isMongoId()
    .withMessage("must to be found id"),
  validatorMiddleware,
];

const Category = require("../../modules/category/Model/category.model");
const subCategory = require("../../modules/category/Model/subCategory.model");

exports.validatorCreateProduct = [
  check("title")
    .notEmpty()
    .withMessage("Product required")
    .isLength({ min: 3 })
    .withMessage("Too short product title")
    .isLength({ max: 100 })
    .withMessage("Too Long product title")
    .custom((val,{req})=>{
      req.body.slug = slugify(val)
      return true;
    }),
  check("description")
    .notEmpty()
    .withMessage("description required")
    .isLength({ min: 5 })
    .withMessage("Too short product description")
    .isLength({ max: 2000 })
    .withMessage("Too Long product description"),
  check("quantity")
    .notEmpty()
    .withMessage("product quantity is required")
    .isNumeric()
    .withMessage("Product quantity must be quantity"),
  check("sold")
    .optional()
    .isNumeric()
    .withMessage("product sold must be a number"),
  check("price")
    .notEmpty()
    .withMessage("Product Price is required")
    .isNumeric()
    .withMessage("Product Number must be a number")
    .isLength({ max: 20 })
    .withMessage("Too Long Product Price"),
  check("priceAfterDiscount")
    .optional()
    .isNumeric()
    .withMessage("Product price After Discount must be a number")
    .toFloat()
    .custom((value, { req }) => {
      if (req.body.price <= value) {
        throw new Error("The Discount Price must be lower than Price");
      }
      return true;
    }),
  check("colors")
    .isArray()
    .optional()
    .withMessage("available Colors should be array of string"),
  check("imageCover").notEmpty().withMessage("Product image Cover is required"),
  check("images")
    .isArray()
    .optional()
    .withMessage("available Colors should be array of string"),
  check("category")
    .notEmpty()
    .withMessage("Category is required and Product must be belong to Category")
    .isMongoId()
    .withMessage("Invalid ID Format")
    .custom((categoryId) =>
      Category.findById(categoryId).then((category) => {
        if (!category) {
          return Promise.reject(
            new Error(`No Category for this id : ${categoryId}`)
          );
        }
      })
    ),
  check("subcategories")
    .optional()
    .isMongoId()
    .withMessage("Invalid ID Format")
    .custom((subcategoriesIds) =>
      subCategory
        .find({ _id: { $exists: true, $in: subcategoriesIds } })
        .then((result) => {
          if (result.length < 1 || result.length !== subcategoriesIds.length) {
            return Promise.reject(new Error(`No SubCategories Ids`));
          }
        })
    )
    .custom((val, { req }) =>
      subCategory
        .find({ Category: req.body.category })
        .then((subcategories) => {
          const subcategoriesIdsInDB = [];
          subcategories.forEach((subcatgry) => {
            subcategoriesIdsInDB.push(subcatgry._id.toString());
          });
          //check if subCategories Ids db include subCategories req.body (true,false)
          const checker = (target, arr) => target.every((v) => arr.includes(v));
          if (!checker(val, subcategoriesIdsInDB)) {
            return Promise.reject(
              new Error(`SubCategories doesn't belong to Category`)
            );
          }
        })
    ),
  check("brand").optional().isMongoId().withMessage("Invalid ID Formatl"),
  check("ratingsAverage")
    .optional()
    .isNumeric()
    .withMessage("should to be a Number")
    .isLength({ min: 1 })
    .withMessage("ratingsAverage must be above or equal 1")
    .isLength({ max: 5 })
    .withMessage("Rating must be below or equal 5"),
  check("ratingsQuantity")
    .optional()
    .isNumeric()
    .withMessage("Ratings Quantity must to be Number"),
  validatorMiddleware,
];

exports.validatorUpdateProduct = [
  check("id")
    .notEmpty()
    .withMessage("Invalid Product Id Format")
    .isMongoId()
    .withMessage("must to be found id"),
  check("title")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddleware,
];

exports.validatorDeleteProduct = [
  check("id")
    .notEmpty()
    .withMessage("Invalid Product Id Format")
    .isMongoId()
    .withMessage("must to be found id"),
  validatorMiddleware,
];
