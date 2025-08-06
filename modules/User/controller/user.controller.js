const sharp = require("sharp");
const asynchandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");
const {
  uploadSingleImg,
} = require("../../../middlewares/uploadImageMiddleware");
const factory = require("../../../utils/handlerFactory");
const ApiError = require("../../../utils/apiError");
const bcrypt = require("bcryptjs")
const user = require("../Model/user.model");

const resizeImg = asynchandler(async (req, res, next) => {
  const filename = `User-${uuidv4()}-${Date.now()}.jpeg`;
  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 700)
      .toFormat("jpeg")
      .jpeg({ quality: 95 })
      .toFile(`uploads/Users/${filename}`);
    req.body.profileImg = filename;
  }
  next();
});

const uploadUserImg = uploadSingleImg("profileImg");

// FOR ADMIN (@Access => PRIVATE)

const createUser = factory.createOne(user);

const getUsers = factory.getAll(user);

const getUserById = factory.getOne(user);

const updateUser = asynchandler(async (req, res, next) => {
  const { id } = req.params;
  const { name, phone, email, slug, role, active } = req.body;
  const document = await user.findByIdAndUpdate(
    id,
    {
    name,
    phone,
    email,
    slug,
    role,
    active
  },
    {
      new: true,
    }
  );
  if (document) {
    return res.status(201).json({ newDocument: document });
  }
  return next(new ApiError(`Not found document for this : ${id}`, 404));
});



const changeUserPassowrd = asynchandler(async (req, res, next) => {
  const { id } = req.params;
  const { password } = req.body;
  const document = await user.findByIdAndUpdate(
    id,
    {
      password: await bcrypt.hash(password,12)
    },
    {
      new: true,
    }
  );
  if (document) {
    return res.status(201).json({ newDocument: document });
  }
  return next(new ApiError(`Not found document for this : ${id}`, 404));
});


const deleteUser = factory.deleteOne(user);

module.exports = {
  createUser,
  getUserById,
  getUsers,
  updateUser,
  deleteUser,
  uploadUserImg,
  resizeImg,
  changeUserPassowrd,
};
