const asyncHandler = require("express-async-handler");

const User = require("../../User/Model/user.model");

const addAddress = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.user._id, {
    $addToSet: { addresses: req.body },
  });
  res.status(200).json(
    {
      status: "success",
      message: "Address added successfully",
      data: user.addresses,
    },
    { new: true }
  );
});

const deleteAddress = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.user._id, {
    $pull: { addresses: { _id: req.params.addressId } },
  });
  res.status(200).json(
    {
      status: "success",
      message: "Address deleted successfully",
      data: user.addresses,
    },
    { new: true }
  );
});

const getAddressesForLoggedUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id).populate("addresses");
  res.status(200).json({
    result: user.addresses.length,
    status: "success",
    message: "Addresses belongs u",
    data: user.addresses,
  });
});

module.exports = {
  addAddress,
  deleteAddress,
  getAddressesForLoggedUser,
};
