const asynchandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");

const {
  uploadMultipleImgs,
} = require("../../../middlewares/uploadImageMiddleware");
const factory = require("../../../utils/handlerFactory");
const product = require("../Model/product.model");

const uploadImagesProduct = uploadMultipleImgs([
  { name: "imageCover", maxCount: 1 },
  { name: "images", maxCount: 5 },
]);

const resizeImageProduct = asynchandler(async (req, res, next) => {
  // 1) ImageCover processing by SHARP
  if (req.files.imageCover) {
    const imageCoverFilename = `products-${uuidv4()}-${Date.now()}-cover.jpeg`;
    await sharp(req.files.imageCover[0].buffer)
      .resize(2000, 1333)
      .toFormat("jpeg")
      .jpeg({ quality: 95 })
      .toFile(`upload/products/${imageCoverFilename}`);
    // save ImageCover in DB
    req.body.imageCover = imageCoverFilename;
  }
  // 2) Images processing by SHARP
  if (req.files.images) {
    const imgsList = req.files.images;
    req.body.images = [];
    await Promise.all(
      imgsList.map(async (img, index) => {
        const imagesFilename = `products-${uuidv4()}-${Date.now()}-${index + 1}.jpeg`;
        await sharp(img.buffer)
          .resize(2000, 1333)
          .toFormat("jpeg")
          .jpeg({ quality: 95 })
          .toFile(`upload/products/${imagesFilename}`);
        // save Images in DB
        req.body.images.push(imagesFilename);
      })
    );
    next();
  }
});

const createProduct = factory.createOne(product);

const getProducts = factory.getAll(product, "products");

const getProduct = factory.getOne(product,"reviews");

const deleteProduct = factory.deleteOne(product);

const updateProuct = factory.updateOne(product);

// 1] Filtering

// const queryStringObj = { ...req.query }; // => bakhod copy mn el obj msh basawy el obj 3shan lama a3ml 7aga feeh mayt2srsh
// const exludeFields = ["page", "limit", "fields", "sort"];
// exludeFields.forEach((field) => delete queryStringObj[field]);
// Apply filteration using[gte,gt,lte,lt]
// { price : {$gte:50} , ratingsAverage : {$gte : 4} } (el logic) => ?price[gte]=50&ratingsAverage[gte]=4 (req.query = queryStringObj)
// let queryStr = JSON.stringify(queryStringObj);
// queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`); // => b3d m khaletha string 3shan a3ml replace , el replace f el aghlb bn3mlha 3shan (regex,callback)

// 2] Pagination

// const page = req.query.page * 1 || 1;
// const limit = req.query.limit * 1 || 50;
// const skip = (page - 1) * limit;

// 3] Sorting :

// if (req.query.sort) {
// price,-sold => [price,-sold] ==> price -sold ========> hwa msh hy-sort gher kda yeb2a mafehosh "," ely gya f el req
//   const sortBy = req.query.sort.split(",").join(" ");
//   mongooseQuery = mongooseQuery.sort(sortBy);
// } else {
//   mongooseQuery = mongooseQuery.sort("-createdAt");
// }

// 4] fild Limiting

// if (req.query.fields) {
//   const fields = req.query.fields.split(",").join(" ");
//   mongooseQuery = mongooseQuery.select(fields);
// } else {
//   mongooseQuery = mongooseQuery.select("-__v");
// }

// 5] searching

// if (req.query.keyword) {
//   const keyword = req.query.keyword;
//   const query = {
//     $or: [
//       { title: { $regex: keyword, $options: "i" } },
//       { description: { $regex: keyword, $options: "i" } },
//     ],
//   };
// console.log("Search Query:", JSON.stringify(query, null, 2));
//   mongooseQuery = mongooseQuery.find(query);
// }

module.exports = {
  createProduct,
  getProduct,
  getProducts,
  deleteProduct,
  updateProuct,
  uploadImagesProduct,
  resizeImageProduct,
};
