const asyncHandler = require("express-async-handler");

const User = require("../../User/Model/user.model");

const addProductToWishList = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    // $addToSet => add ProductId to wishList arr if productId not Exist
    {
      $addToSet: { wishList: req.body.productId },
    },
    { new: true }
  );
  res.status(200).json({
    status: "success",
    message: "Product added successfully To wishList",
    data: user.wishList,
  });
});

const deletProductToWishList = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    // $pull => remove ProductId from wishList arr if productId Exist
    {
      $pull: { wishList: req.params.productId },
    },
    { new: true }
  );
  res.status(200).json({
    status: "success",
    message: "Product deleted successfully from wishList",
    data: user.wishList,
  });
});

// To get products ely f el wishList ely betkhos el user
const getloggedUserWishList = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id).populate("wishList");
  res.status(200).json({
    result: user.wishList.length,
    status: "success",
    message: "Products belongs u",
    data: user.wishList,
  });
});



module.exports = {
  addProductToWishList,
  deletProductToWishList,
  getloggedUserWishList,
};
