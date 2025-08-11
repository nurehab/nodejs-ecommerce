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

// 1] SIGN UP :

const signUp = asynchandler(async (req, res, next) => {
  const { name, email, password } = req.body;
  const user = await User.create({ name, email, password });
  const token = createToken(user._id);
  return res.status(201).json({ data: user, token });
});

// 2] LOGIN

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

// MAKE SURE THE USER IS SIGNED UP AND LOGGED IN (AUTHENTICATED)

const protect = asynchandler(async (req, res, next) => {
  // 1) check if token exist , if existed HOLD IT
  let token;
  const { authorization } = req.headers;
  if (authorization && authorization.startsWith("Bearer")) {
    token = authorization.split(" ")[1];
    if (!token) {
      return next(
        new ApiError(
          "you are not Login,please login to get access this route",
          401
        )
      );
    }
  }
  // 2) VERIFY token no change happens OR EXPIRE token
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  // 3) check user mn khlal el user._id (decoded.userId) 3lshan feeh cases keter momkn te7sl f ywslna enna ne3l login mn tany
  const currentUser = await User.findById(decoded.userId);
  if (!currentUser) {
    return next(
      new ApiError("The user that belong to this token no longer exist", 401)
    );
  }
  // 4) check password's user momken yekon 3ml change password (passwordChanged) f han7tag ne3ml login ll user 3shan ye3ml create L token tany
  if (currentUser.passwordChanged) {
    const passwordChangedTimestamp = parseInt(
      currentUser.passwordChanged.getTime() / 1000,
      10
    );
    if (passwordChangedTimestamp > decoded.iat) {
      return next(new ApiError("This user changed his password", 401));
    }
  }
  req.user = currentUser;
  next();
});


const allowedTo = (...roles)  => // ["manger","admin"]
  asynchandler(async(req,res,next)=>{
    // acces Roles
    // access user regiser (req.user = currentUser)
    if(!roles.includes(req.user.role)){
      return next (new ApiError("you don't have access on this Route",403))
    }
    next()
  })

module.exports = {
  signUp,
  login,
  protect,
  allowedTo
};
