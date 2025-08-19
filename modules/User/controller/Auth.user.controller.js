const crypto = require("crypto");

const asynchandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const ApiError = require("../../../utils/apiError");
const { sendEmail } = require("../../../utils/sendEmail");

const User = require("../Model/user.model");

// we will create method for CreateToken cuz duplicating in handlers
const createToken = require("../../../utils/Token/createToken")

const hashedCode = (code) => {
  crypto.createHash("sha256").update(code).digest("hex");
};

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
  // 3) check user mn khlal el user._id (decoded.userId) 3lshan feeh cases keter momkn te7sl f ywslna enna ne3ml login mn tany
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

// Authorization (user premissions)

const allowedTo = (
  ...roles // ["manger","admin"]
) =>
  asynchandler(async (req, res, next) => {
    // acces Roles
    // access user regiser (req.user = currentUser)
    if (!roles.includes(req.user.role)) {
      return next(new ApiError("you don't have access on this Route", 403));
    }
    next();
  });

// ------ CYCLE OF FORGET PASSWORD ------ THREE HANDLERS

// Forgot Password => 1) send Reset Code to Email - 2) verify Reset Code that sent Email - 3) set The new Password

// 1]] send Reset Code To Email :
//  a) check Email ,
//  b) Generate Reset Code 3ebara 3n 6 arkam w yetsave f el db ,
//  c) send el reset code LL email

const forgotPassword = asynchandler(async (req, res, next) => {
  // a)
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return next(new ApiError(`There is no User with that email ${email}`, 404));
  }

  //b)
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();

  // saved Hashed Reset code in DB
  const hashedResetCode = hashedCode(resetCode);

  const hashedResetCodeExpire = Date.now() + 10 * 60 * 1000;

  const hashedResetCodeVerify = false;

  user.hashedResetCode = hashedResetCode;
  user.hashedResetCodeExpire = hashedResetCodeExpire;
  user.hashedResetCodeVerify = hashedResetCodeVerify;

  await user.save();

  // c)
  const message = `Hi ${user.name},\n we recived a request  to reset the password on yoyr E-shop Account. \n ${resetCode} \n Enter this OTP to complete the reset.\n Thanks for helping us keep your account secure.\n The E-shop Team`;
  try {
    await sendEmail({
      email: user.email,
      subject: "Your Password reset Code (Valid for 10 min)",
      message,
    });
  } catch (err) {
    user.hashedResetCode = undefined;
    user.hashedResetCodeExpire = undefined;
    user.hashedResetCodeVerify = undefined;

    await user.save();

    return next(new ApiError("There is an error in sending Email", 500));
  }
  res
    .status(200)
    .json({ status: "success", message: "Reset code sent to email" });
});

// 2]] Handler => verify Reset Code
const verifyResetpasswordCode = asynchandler(async (req, res, next) => {
  // 1) check user based on hash reset Code
  const verifyHashedResetCode = hashedCode(req.body.resetCode);

  const user = await User.findOne({
    hashedResetCode: verifyHashedResetCode,
    hashedResetCodeExpire: { $gt: Date.now() },
  });
  if (!user) {
    return next(new ApiError("Inavlid Verify Reset code or Expired", 500));
  }

  // 2) valid Reset Code
  user.hashedResetCodeVerify = true;
  await user.save();

  res.status(200).json({ status: "sucess" });
});

// 3]] Handler => reset password
const resetPassword = asynchandler(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return next(new ApiError(`There is no User with that email ${email}`, 404));
  }
  if (!user.hashedResetCodeVerify) {
    return next(new ApiError("This user is not valid", 500));
  }
  user.password = req.body.newPassword;
  user.hashedResetCode = undefined;
  user.hashedResetCodeExpire = undefined;
  user.hashedResetCodeVerify = undefined;
  await user.save();

  // if everything is ok , GENERATE NEW TOKEN
  const token = createToken(user._id);

  res.status(200).json({ status: "sucess", Token: token });
});




module.exports = {
  signUp,
  login,
  protect,
  allowedTo,
  forgotPassword,
  verifyResetpasswordCode,
  resetPassword,
  
};
