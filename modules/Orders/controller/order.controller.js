const stripe = require("stripe")(process.env.STRIPE_SECRET);
const asyncHandler = require("express-async-handler");
const ApiError = require("../../../utils/apiError");
const factory = require("../../../utils/handlerFactory");

const Product = require("../../Products/Model/product.model");
const Cart = require("../../Cart/Model/cart.model");
const Order = require("../Model/order.model");

const createCashOrder = asyncHandler(async (req, res, next) => {
  // App Settings
  const taxPrice = 0;
  const shippingPrice = 0;
  // 1]
  const cart = await Cart.findById(req.params.cartId);
  if (!cart) {
    return next(new ApiError(`can't get cart for:${req.params.cartId}`, 404));
  }
  // 2]
  const cartPrice = cart.totalPriceAfterDiscount
    ? cart.totalPriceAfterDiscount
    : cart.totalCartPrice;

  const totalPrice = cartPrice + taxPrice + shippingPrice;

  // 3]
  const order = await Order.create({
    user: req.user._id,
    cartItems: cart.cartItems,
    shippingAdress: req.body.shippingAdress,
    totalOrderPrice: totalPrice,
  });
  // 4]
  if (order) {
    const bulkOptions = cart.cartItems.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
      },
    }));
    await Product.bulkWrite(bulkOptions, {});
    // 5]
    await Cart.findByIdAndDelete(req.params.cartId);
  }
  res
    .status(200)
    .json({ status: "successful", message: "submit Order", data: order });
});

// Middleware for en el user yegeb ordrarato bs

const getOrderForLoggedUser = asyncHandler(async (req, res, next) => {
  if (req.user.role === "user") {
    req.filterObj = { user: req.user._id };
  }
  next();
});

const getOrders = factory.getAll(Order);
const getspecificOrder = factory.getOne(Order);

// ReFactor
const updateMethod = (fieldName, dataDFieldName) =>
  asyncHandler(async (req, res, next) => {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return next(new ApiError(`such no order about:${req.params.id}`, 404));
    }

    order[fieldName] = true;
    order[dataDFieldName] = Date.now();
    const orderUpdated = await order.save();
    res.status(200).json({ status: "success", data: orderUpdated });
  });

const updatePayOrder = updateMethod("isPaid", "paidAt");
const updateDeliverOrder = updateMethod("isDelivered", "deliveredAt");

// create chekout-session
const createCheckOutSession = asyncHandler(async (req, res, next) => {
  // App Settings
  const taxPrice = 0;
  const shippingPrice = 0;
  const cart = await Cart.findById(req.params.cartId);
  if (!cart) {
    return next(new ApiError(`can't get cart for:${req.params.cartId}`, 404));
  }
  const cartPrice = cart.totalPriceAfterDiscount
    ? cart.totalPriceAfterDiscount
    : cart.totalCartPrice;
  const totalOrderPrice = cartPrice + taxPrice + shippingPrice;
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "egp",
          product_data: {
            name: req.user.name,
          },
          unit_amount: totalOrderPrice * 100,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${req.protocol}://${req.get("host")}/orders`,
    cancel_url: `${req.protocol}://${req.get("host")}/cart`,
    client_reference_id: req.params.cartId,
    customer_email: req.user.email,
    metadata: req.body.shippingAdress,
  });

  res.status(200).json({ status: "success", session });
});

module.exports = {
  createCashOrder,
  getOrders,
  getspecificOrder,
  getOrderForLoggedUser,
  updatePayOrder,
  updateDeliverOrder,
  createCheckOutSession,
};
