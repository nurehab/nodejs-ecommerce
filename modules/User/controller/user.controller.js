const sharp = require("sharp");
const asynchandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");
const {
  uploadSingleImg,
} = require("../../../middlewares/uploadImageMiddleware");
const factory = require("../../../utils/handlerFactory");
const ApiError = require("../../../utils/apiError");
const createToken = require("../../../utils/Token/createToken");
const User = require("../Model/user.model");

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

const createUser = factory.createOne(User);

const getUsers = factory.getAll(User);

const getUserById = factory.getOne(User);

const updateUser = asynchandler(async (req, res, next) => {
  const { id } = req.params;
  const { name, phone, email, slug, role, active } = req.body;
  const document = await User.findByIdAndUpdate(
    id,
    {
      name,
      phone,
      email,
      slug,
      role,
      active,
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
  const document = await User.findByIdAndUpdate(
    id,
    {
      password: await bcrypt.hash(password, 12),
      passwordChanged: Date.now(),
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

const deleteUser = factory.deleteOne(User);

// Middleware for user to get ur data and update it
// FOR USER (@Access => PROTECT)
const getUserLogged = asynchandler(async (req, res, next) => {
  req.params.id = req.user._id;
  next();
});

const changeUserPassowrdLogged = asynchandler(async (req, res, next) => {
  const { password } = req.body;
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      password: await bcrypt.hash(password, 12),
      passwordChanged: Date.now(),
    },

    {
      new: true,
    }
  );

  const token = createToken(user._id);

  return res.status(201).json({ data: user, token });
});

const updateGetUserLogged = asynchandler(async (req, res, next) => {
  const { name, email, phone } = req.body;
  const updateGetUser = await User.findByIdAndUpdate(
    req.user._id,
    {
      name,
      email,
      phone,
    },
    {
      new: true,
    }
  );

  res.status(201).json({ data: "updated", updateGetUser });
});


const deactiveLoggedUser = asynchandler(async(req,res,next)=>{
  await User.findByIdAndUpdate(req.user._id,{active:false})
  res.status(201).json({status:"success"})
})

module.exports = {
  createUser,
  getUserById,
  getUsers,
  updateUser,
  deleteUser,
  uploadUserImg,
  resizeImg,
  changeUserPassowrd,
  getUserLogged,
  changeUserPassowrdLogged,
  updateGetUserLogged,
  deactiveLoggedUser,
};
