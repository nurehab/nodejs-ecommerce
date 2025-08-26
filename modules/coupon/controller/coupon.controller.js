const factory = require("../../../utils/handlerFactory");

const Coupon = require("../Model/coupon.model");

const getCoupons = factory.getAll(Coupon);
const getCoupon = factory.getOne(Coupon);
const addCoupon = factory.createOne(Coupon);
const updateCoupon = factory.updateOne(Coupon);
const deleteCoupon = factory.deleteOne(Coupon);

module.exports = {
  getCoupons,
  getCoupon,
  addCoupon,
  updateCoupon,
  deleteCoupon,
};
