const ApiError = require("../utils/apiError");

require("dotenv").config();

const sendErrorforDev = (err, res) =>
  res.status(err.statusCode).json({
    err: {
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    },
  });

const sendErrorforProd = (err, res) =>
  res.status(err.statusCode).json({
    err: {
      status: err.status,
      message: err.message,
    },
  });

const handleJwtInvalidSignature = () =>
  new ApiError("Invalid Token need to login for access", 401);
const handleJwtInvalidExpired = () =>
  new ApiError("Expired Token need to login for access", 401);

const globalError = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorforDev(err, res);
  } else {
    if (err.name === "JsonWebTokenError") err = handleJwtInvalidSignature();
    if (err.name === "TokenExpiredError") err = handleJwtInvalidExpired();
    sendErrorforProd(err, res);
  }
};

module.exports = globalError;
