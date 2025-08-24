const mongoose = require("mongoose");
const Product = require("../../Products/Model/product.model");

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

// we create method for => calcAvgAndquantityRatings
reviewSchema.statics.calcAvgAndQuantityRatings = async function (productId) {
  const result = await this.aggregate([
    // Satge 1 : we get all reviews of specific product
    { $match: { product: productId } },
    // Stage 2 : calc Average Ratings & quantity Raatings based on product id
    {
      $group: {
        _id: "$product",
        avgRatings: { $avg: "$ratings" },
        quantityRatings: { $sum: 1 },
      },
    },
  ]);
  // to show [ratingsAverage & ratingsQuantity ] in products after calc
  if (result.length > 0) {
    await Product.findByIdAndUpdate(productId, {
      ratingsAverage: result[0].avgRatings,
      ratingsQuantity: result[0].quantityRatings,
    });
  } else {
    await Product.findByIdAndUpdate(productId, {
      ratingsAverage: 0,
      ratingsQuantity: 0,
    });
  }
};

reviewSchema.post("save", function (next) {
  this.constructor.calcAvgAndQuantityRatings(this.product);
});

reviewSchema.pre(/^find/, function (next) {
  this.populate({ path: "user", select: "name" });
  next();
});

const reviewModel = mongoose.model("Review", reviewSchema);

module.exports = reviewModel;
