const path = require("path");

const express = require("express");
// const cors = require("cors");
const compression = require("compression");
const morgan = require("morgan");
require("dotenv").config();

const app = express();

const {
  webhookCheckOut,
} = require("./modules/Orders/controller/order.controller");

// cors setting (Other domains to access ur app)
// app.use(cors());
// app.options("*", cors());

// Compression for response (compress all response)
app.use(compression());

// checkout webhook
app.post(
  "/webhook-checkout",
  express.raw({ type: "application/json" }),
  webhookCheckOut
);

//Middlware
app.use(express.json());
app.use(express.static(path.join(__dirname, "uploads")));

const mountRoutes = require("./utils/mountroutes");

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`mode : ${process.env.NODE_ENV}`);
}
// Connect with db
const dbConnection = require("./config/database.config");

dbConnection();

const ApiError = require("./utils/apiError");
const globalError = require("./middlewares/error.middlware");

// connect with Routes (Mount Routes) - - - bab3tlo el express app => const app = express()

mountRoutes(app);

app.all(/^.*$/, (req, res, next) => {
  next(new ApiError(`Can't found this route : ${req.originalUrl}`), 400);
});

// GLobaln Error handling For Express
app.use(globalError);

const server = app.listen(process.env.PORT || 8000, () => {
  console.log(`App is running on ${process.env.PORT}`);
});

// Events => Listen (el event ely halisten 3aleh) => [listener] : callback(err)  ===> Handle Rejection (asyncouns) outside EXPRESS
process.on("unhandledRejection", (err) => {
  console.log(`UnhandledRejection Errors: ${err.name} | ${err.message}`);
  server.close(() => {
    console.log(`Shutting Down . . . .`);
    process.exit(1);
  });
});
