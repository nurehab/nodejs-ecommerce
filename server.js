const path = require("path")

const express = require("express");
const morgan = require("morgan");
require("dotenv").config();

const app = express();
//Middlware
app.use(express.json());
app.use(express.static(path.join(__dirname,"uploads")))

const categoryRoute = require("./modules/category/routes/category.routes");
const SubCategoryRoute = require("./modules/category/routes/subCategory.routes");
const brandRoute = require("./modules/Brands/Routes/Brand.router");
const productRoute = require("./modules/Products/Router/product.routs");
const userRoute = require("./modules/User/Routes/user.route");
const authRoute = require("./modules/User/Routes/auth.route");
const reviewRoute = require("./modules/Review/Routes/review.route");

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`mode : ${process.env.NODE_ENV}`);
}
// Connect with db
const dbConnection = require("./config/database.config");
const ApiError = require("./utils/apiError");
const globalError = require("./middlewares/error.middlware");

dbConnection();
// connect with Routes
app.use("/api/v1/category", categoryRoute);
app.use("/api/v1/subCategory", SubCategoryRoute);
app.use("/api/v1/brands", brandRoute);
app.use("/api/v1/products", productRoute);
app.use("/api/v1/users", userRoute);
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/reviews", reviewRoute);


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
