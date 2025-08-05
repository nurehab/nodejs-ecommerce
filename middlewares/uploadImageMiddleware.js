const multer = require("multer");
const ApiError = require("../utils/apiError");

const multerOptions = () => {
  // 1) Disk Storage engine
  // const multerStorage = multer.diskStorage({
  //   destination: (req,file,cb) =>{
  //     cb(null,"uploads/categories")
  //   },
  // filename:(req,file,cb)=>{
  // category-${uuidv4}-${Date.now()}.ext => file.mimetype.split("/")[1]
  //   const ext = file.mimetype.split("/")[1]
  //   const filename = `category-${uuidv4()}-${Date.now()}.${ext}`;
  //   cb(null,filename)
  // }
  // })

  // 2) Memory Storage engine
  const multerStorage = multer.memoryStorage();

  const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new ApiError("Images Only Allowed", 400), false);
    }
  };
  const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
  });

  return upload;
};

const uploadSingleImg = (fieldname) => multerOptions().single(fieldname);

const uploadMultipleImgs = (arrayOfFields) =>
  multerOptions().fields(arrayOfFields);

module.exports = { uploadSingleImg, uploadMultipleImgs };
