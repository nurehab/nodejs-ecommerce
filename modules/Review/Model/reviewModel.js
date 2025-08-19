const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    title: String,
    ratings: {
      type: Number,
      required: [true, "rating is Required"],
      min: [1, "Min ratings value is 1.0"],
      max: [5, "Max ratings value is 5.0"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Review must belong to user"],
    },
    product: {
      type: mongoose.Schema.ObjectId,
      ref: "product",
      required: [true, "Review must belong to product"],
    },
  },
  { timestamps: true }
);

const reviewModel = mongoose.model("Review", reviewSchema);

module.exports = reviewModel;
