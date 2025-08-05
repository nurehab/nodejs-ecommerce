require("dotenv").config()

const globalError = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  
  if (process.env.NODE_ENV === "development") {
    sendErrorforDev(err, res);
  } else {
    sendErrorforProd(err, res);
  }
};

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

module.exports = globalError;
