const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const asynchandler = require("express-async-handler");
const {
  uploadSingleImg,
} = require("../../../middlewares/uploadImageMiddleware");
const factory = require("../../../utils/handlerFactory");
const category = require("../Model/category.model");

const resizeImg = asynchandler(async (req, res, next) => {
  const filename = `category-${uuidv4()}-${Date.now()}.jpeg`;
  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`uploads/categories/${filename}`);
      
    // save Imagename in DB
    req.body.image = filename;
  }

  next();
});

const uploadCategories = uploadSingleImg("image");

const getCategories = factory.getAll(category);

const getCategory = factory.getOne(category);

const createCategory = factory.createOne(category);
// const newCategory = new categoryModel({name,slug:slugify(name),})
// await new newCategory.save()
// res.send("added")

const updateCategory = factory.updateOne(category);

const deleteCategory = factory.deleteOne(category);

module.exports = {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
  uploadCategories,
  resizeImg,
};
