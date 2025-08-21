const factory = require("../../../utils/handlerFactory");
const subCategory = require("../Model/subCategory.model");


// Nested Route (Post/Create)
const setCategoryIdInsteadOFbody = (req, res, next) => {
  if (!req.body.category) req.body.category = req.params.categoryId;
  next();
};

// Nested Route (Get)
const createFilterObject = (req, res, next) => {
  let filterObject = {};
  if (req.params.categoryId) filterObject = { category: req.params.categoryId };
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
