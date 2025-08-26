const categoryRoute = require("../modules/category/routes/category.routes");
const SubCategoryRoute = require("../modules/category/routes/subCategory.routes");
const brandRoute = require("../modules/Brands/Routes/Brand.router");
const productRoute = require("../modules/Products/Router/product.routs");
const userRoute = require("../modules/User/Routes/user.route");
const authRoute = require("../modules/User/Routes/auth.route");
const reviewRoute = require("../modules/Review/Routes/review.route");
const wishListRoute = require("../modules/wishList/router/wishList.route");
const addressRoute = require("../modules/Addresses/router/address.route");
const couponRoute = require("../modules/coupon/router/coupon.router");
const cartRoute = require("../modules/Cart/router/cart.route");


const mountRoutes = (app) =>{
    app.use("/api/v1/category", categoryRoute);
    app.use("/api/v1/subCategory", SubCategoryRoute);
    app.use("/api/v1/brands", brandRoute);
    app.use("/api/v1/products", productRoute);
    app.use("/api/v1/users", userRoute);
    app.use("/api/v1/auth", authRoute);
    app.use("/api/v1/reviews", reviewRoute);
    app.use("/api/v1/wishList", wishListRoute);
    app.use("/api/v1/address", addressRoute);
    app.use("/api/v1/coupon", couponRoute);
    app.use("/api/v1/cart", cartRoute);
}


module.exports = mountRoutes