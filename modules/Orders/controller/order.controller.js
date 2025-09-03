const stripe = require("stripe")(process.env.STRIPE_SECRET);
const asyncHandler = require("express-async-handler");
const ApiError = require("../../../utils/apiError");
const factory = require("../../../utils/handlerFactory");

const User = require("../../User/Model/user.model");
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

// create chekout-session and send it as a response
const createCheckOutSession = asyncHandler(async (req, res, next) => {
  // App Settings
  const taxPrice = 0;
  const shippingPrice = 0;
  // 1] get cart depend on cartId
  const cart = await Cart.findById(req.params.cartId);
  if (!cart) {
    return next(new ApiError(`can't get cart for:${req.params.cartId}`, 404));
  }
  // 2] Get order price depend on cart price "check if coupon apply !"
  const cartPrice = cart.totalPriceAfterDiscount
    ? cart.totalPriceAfterDiscount
    : cart.totalCartPrice;
  const totalOrderPrice = cartPrice + taxPrice + shippingPrice;
  // 3] create session page (stripe checkout session)
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

  // 4] send el session To el response :
  res.status(200).json({ status: "success", session });
});
// session => event.data.object
const createCartOrder = async (session) => {
  // baghz 3shan A-create order
  const cartId = session.client_reference_id;
  const shippingAdress = session.metadata;
  const orderprice = session.amount_total / 100;

  const cart = await Cart.findById(cartId);
  const user = await User.findOne({ email: session.customer_details.email });
  
// CREATE ORDER WITH PAYMENTMETHODTYPE [CARD] DEPENDS OF |
  const order = await Order.create({
    user: user._id,
    cartItems: cart.cartItems,
    shippingAdress,
    totalOrderPrice: orderprice,
    isPaid: true,
    paidAt: Date.now(),
    paymentMethodType: "card",
  });

  // After creating order , DECREMENT - product (quantity), INCREMENT + product (sold)
  if (order) {
    const bulkOptions = cart.cartItems.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
      },
    }));
    await Product.bulkWrite(bulkOptions, {});
    
    // 5] clear cart depend on cartId
    await Cart.findByIdAndDelete(cartId);
  }
};

// This webhook will run when stripe payment success paid
const webhookCheckOut = asyncHandler(async (req, res, next) => {
  const sig = req.headers["stripe-signature"];

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body, // de ely feeh el session + showyt more details
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    // Create Order , 3shan a2dr ageb meno el client_reference_id => cartId
    createCartOrder(event.data.object);
  }
  // betzhr f el webhook beta3tk
  return res.status(200).json({status:"success",recieved:true})
});

module.exports = {
  createCashOrder,
  getOrders,
  getspecificOrder,
  getOrderForLoggedUser,
  updatePayOrder,
  updateDeliverOrder,
  createCheckOutSession,
  webhookCheckOut,
};
