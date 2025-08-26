const asyncHandler = require("express-async-handler");

const Coupon = require("../../coupon/Model/coupon.model");
const Product = require("../../Products/Model/product.model");
const Cart = require("../Model/cart.model");
const ApiError = require("../../../utils/apiError");

// method for calcTotalPrice
const calcTotalPrice = (cart) => {
  let totalPrice = 0;
  cart.cartItems.forEach((item) => {
    totalPrice += item.quantity * item.price;
  });
  cart.totalCartPrice = totalPrice;
  cart.totalPriceAfterDiscount = undefined;
  return totalPrice;
};

const addProductToCart = asyncHandler(async (req, res, next) => {
  const { productId, color } = req.body;
  const product = await Product.findById(productId);
  // get cart for logged user
  let cart = await Cart.findOne({ user: req.user._id });
  // lw el user ma3ndosh cart w 3ayz yedef product f el cart hankhleh ye3ml cart with el product
  if (!cart) {
    cart = await Cart.create({
      user: req.user._id,
      cartItems: [{ product: productId, color, price: product.price }],
    });
  } else {
    // lw 3ndk cart b2a hayb2a feeh two scaniro el awel lw el product hwa hwa b nafs el lon han3ml update LL quantity beta3to
    const productIndex = cart.cartItems.findIndex(
      (item) => item.product.toString() === productId && item.color === color
    );
    if (productIndex > -1) {
      cart.cartItems[productIndex].quantity += 1;
    } else {
      cart.cartItems.push({
        product: productId,
        color,
        price: product.price,
      });
    }
  }
  calcTotalPrice(cart);

  await cart.save();

  res.status(200).json({
    status: "success",
    message: "product added successefilly",
    numberCartItems: cart.cartItems.length,
    data: cart,
  });
});

const getCartToLoggedUser = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    return next(new ApiError(`No cart for this user:${req.user._id}`, 404));
  }
  return res.status(200).json({
    status: "success",
    message: "products in cart",
    numberCartItems: cart.cartItems.length,
    data: cart,
  });
});

const removeItemForLoggedUser = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOneAndUpdate(
    { user: req.user._id },
    { $pull: { cartItems: { _id: req.params.itemId } } },
    { new: true }
  );
  calcTotalPrice(cart);
  return res.status(200).json({
    status: "success",
    message: "product removed successefilly",
    numberCartItems: cart.cartItems.length,
    data: cart,
  });
});

// To remove all cart
const deleteAllCartForLoggedUser = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOneAndDelete({ user: req.user._id });
  return res.status(200).json({
    status: "success",
    message: "product all deleted",
    numberCartItems: cart.cartItems.length,
    quantitycartItems: cart.cartItems.quantity,
  });
});

// To update qunatity in item
const updateQuantityForItemInCart = asyncHandler(async (req, res, next) => {
  const { quantity } = req.body;
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    return next(new ApiError(`No cart for this user:${req.user._id}`, 404));
  }
  const indexItem = cart.cartItems.findIndex(
    (item) => item._id.toString() === req.params.itemId
  );
  if (indexItem > -1) {
    cart.cartItems[indexItem].quantity = quantity;
  }
  calcTotalPrice(cart);
  await cart.save();
  return res.status(200).json({
    status: "success",
    message: "product quantity updated successefilly",
    numberCartItems: cart.cartItems.length,
    quantitycartItems: cart.cartItems.reduce(
      (acc, item) => acc + item.quantity,
      0
    ),
    data: cart,
  });
});

const applyCoupon = asyncHandler(async (req, res, next) => {
  const { couponName } = req.body;
  const coupon = await Coupon.findOne({
    name: couponName,
    expire: { $gt: Date.now() },
  });
  if (!coupon) {
    return next(new ApiError("This is inavlid or expired coupon", 404));
  }
  // Get discount for logged User
  const cart = await Cart.findOne({ user: req.user._id });
  const totalPrice = cart.totalCartPrice;
  cart.totalPriceAfterDiscount = (
    totalPrice -
    (totalPrice * coupon.discount) / 100
  ).toFixed(2);
  await cart.save();
  return res.status(200).json({
    status: "success",
    message: "product quantity updated successefilly",
    numberCartItems: cart.cartItems.length,
    quantitycartItems: cart.cartItems.reduce(
      (acc, item) => acc + item.quantity,
      0
    ),
    data: cart,
  });
});

module.exports = {
  addProductToCart,
  getCartToLoggedUser,
  removeItemForLoggedUser,
  deleteAllCartForLoggedUser,
  updateQuantityForItemInCart,
  applyCoupon,
};
