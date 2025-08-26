const app = require("express").Router();

const {
  getCoupons,
  getCoupon,
  addCoupon,
  updateCoupon,
  deleteCoupon,
} = require("../controller/coupon.controller");

const authService = require("../../User/controller/Auth.user.controller");

app.use(authService.protect, authService.allowedTo("admin","manager"));

app.route("/").post(addCoupon).get(getCoupons);
app.route("/:id").get(getCoupon).put(updateCoupon).delete(deleteCoupon);

module.exports = app;
