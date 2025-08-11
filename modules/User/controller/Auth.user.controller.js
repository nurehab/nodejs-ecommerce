const asynchandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const ApiError = require("../../../utils/apiError");

const User = require("../Model/user.model");

// we will create method for CreateToken cuz duplicating in handlers
const createToken = (payload) =>
  jwt.sign({ userId: payload }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE_TIME,
  });

// Authentication Handlers (sign up , Login)

const signUp = asynchandler(async (req, res, next) => {
  const { name, email, password } = req.body;
  const user = await User.create({ name, email, password });
  const token = createToken(user._id);
  return res.status(201).json({ data: user, token });
});

const login = asynchandler(async (req, res, next) => {
  // 1) check email & password in the body (han3ml Validation)
  // 2) check email is exists & password is correct
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return next(new ApiError("Invalid Login", 401));
  }
  // 3) Generate Token
  const token = createToken(user._id);
  // 4) send res to client side
  return res.status(200).json({ loginn: user, token });
});

// Autherization Handlers (han3ml protect LL routes 3n tare2 el token)

const protect = asynchandler(async (req, res, next) => {
  // 1) check if token exist , if existed HOLD IT
  let token;
  const { authorization } = req.headers;
  if (authorization && authorization.startsWith("Baerer")) {
    token = authorization.split(" ")[1];
  }
  if (!token) {
    return next(
      new ApiError(
        "you are not Login,please login to get access this route",
        401
      )
    );
  }
  // 2) VERIFY token no change happens OR EXPIRE token
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  console.log (decoded);
  // 3) check user mn khlal el user._id 3lshan feeh cases keter momkn te7l f ywslna enna ne3l login mn tany
  // 4) check password's user momken yekon 3ml change password f han7tag ne3ml login ll user 3shan ye3ml create L token tany
});

module.exports = {
  signUp,
  login,
  protect,
};
