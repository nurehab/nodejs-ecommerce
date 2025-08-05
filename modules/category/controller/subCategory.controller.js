const factory = require("../../../utils/handlerFactory");
const subCategory = require("../Model/subCategory.model");


// Nested Route (Post/Create)
const setCategoryIdInsteadOFbody = (req, res, next) => {
  if (!req.body.Category) req.body.Category = req.params.categoryId;
  next();
};

// Nested Route (Get)
const createFilterObject = (req, res, next) => {
  let filterObject = {};
  if (req.params.categoryId) filterObject = { Category: req.params.categoryId };
  req.filterObj = filterObject;
  next();
};


const createSubCategory = factory.createOne(subCategory);

const getSubCategories = factory.getAll(subCategory)

const getSubCategory = factory.getOne(subCategory);

const updateSubCategory = factory.updateOne(subCategory)

const deleteSubCategory = factory.deleteOne(subCategory);




module.exports = {
  createSubCategory,
  getSubCategories,
  getSubCategory,
  updateSubCategory,
  deleteSubCategory,
  setCategoryIdInsteadOFbody,
  createFilterObject,
};
