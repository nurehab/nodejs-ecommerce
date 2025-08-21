const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minLength: [3, "To Short product title"],
      maxLength: [100, "To Long product title"],
    },
    slug: {
      type: String,
      required: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, "product description is required"],
      trim: true,
      minLegnth: [20, "Too short product descreption"],
      maxLegnth: [2000, "Too Long product description"],
    },
    quantity: {
      type: Number,
      required: [true, "product quantity is required"],
    },
    sold: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "product price is required"],
      trim: true,
      max: [200000, "To Long Product price"],
    },
    priceAfterDiscount: {
      type: Number,
    },
    colors: [String],
    imageCover: {
      type: String,
      required: [true, "Product image Cover is required"],
    },
    images: [String],
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: [true, "Product must be belong to category"],
    },
    subcategories: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "subCategory",
      },
    ],
    brand: {
      type: mongoose.Schema.ObjectId,
      ref: "brand",
    },
    ratingsAverage: {
      type: Number,
      min: [1, "Rating must be above or equal 1"],
      max: [5, "Rating must be below or equal 5"],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    // To able virtual poptulate
    toJSON: { virtuals: true }, 
    toObject: { virtuals: true },
  }
);

productSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "product",
  localField: "_id",
});

productSchema.pre(/^find/, function (next) {
  this.populate({
    path: "category",
    select: "-_id",
  });
  next();
});

const setImagesURL = (doc) => {
  if (doc.imageCover) {
    const setImgCoverURL = `${process.env.BASE_URL}/products/${doc.imageCover}`;
    doc.imageCover = setImgCoverURL;
  }
  if (doc.images) {
    const images = [];
    doc.images.forEach((image) => {
      const setImgsURL = `${process.env.BASE_URL}/products/${image}`;
      images.push(setImgsURL);
    });
    doc.images = images;
  }
};

productSchema.post("init", (doc) => {
  setImagesURL(doc);
});

productSchema.post("save", (doc) => {
  setImagesURL(doc);
});

const productModel = mongoose.model("product", productSchema);

module.exports = productModel;
