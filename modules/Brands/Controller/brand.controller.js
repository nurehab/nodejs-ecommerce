const sharp = require("sharp");
const asynchandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");
const {
  uploadSingleImg,
} = require("../../../middlewares/uploadImageMiddleware");
const factory = require("../../../utils/handlerFactory");
const brand = require("../Model/Brand.model");

const resizeImg = asynchandler(async (req, res, next) => {
  const filename = `brand-${uuidv4()}-${Date.now()}.jpeg`;
  await sharp(req.file.buffer)
    .resize(600, 700)
    .toFormat("jpeg")
    .jpeg({ quality: 95 })
    .toFile(`uploads/brands/${filename}`);
  req.body.image = filename;
  next();
});

const uploadBrandImg = uploadSingleImg ("image");

const createBrand = factory.createOne(brand);

const getBrands = factory.getAll(brand);

const getBrandById = factory.getOne(brand);

const updateBrand = factory.updateOne(brand);

const deleteBrand = factory.deleteOne(brand);

module.exports = {
  createBrand,
  getBrandById,
  getBrands,
  updateBrand,
  deleteBrand,
  uploadBrandImg,
  resizeImg,
};
