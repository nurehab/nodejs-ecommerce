const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Order must be belong user"],
    },
    cartItems: [
      {
        product: {
          type: mongoose.Schema.ObjectId,
          ref: "product",
        },
        quantity: Number,
        color: String,
        price: Number,
      },
    ],
    taxPrice: { type: Number, defult: 0 },
    shippingAdress: {
      details: String,
      phone: String,
      city: String,
      postalCode: String,
    },
    shippingPrice: { type: Number, defult: 0 },
    totalOrderPrice: Number,
    paymentMethodType: {
      type: String,
      enum: ["cash", "card"],
      default: "cash",
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    paidAt: Date,
    isDelivered: {
      type: Boolean,
      default: false,
    },
    deliveredAt: Date,
  },
  { timestamps: true }
);

orderSchema.pre(/^find/, function (next) {
  this.populate({ path: "user", select: "name email -_id" }).populate({
    path: "cartItems.product",
    select: "title imageCover -_id",
  });
  next();
});

const orderModel = mongoose.model("order", orderSchema);

module.exports = orderModel;
