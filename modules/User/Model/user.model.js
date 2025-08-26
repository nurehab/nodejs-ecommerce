const mongoose = require("mongoose");

const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "name is Required"],
      trim: true,
    },
    slug: {
      type: String,
      lowercase: true,
    },
    email: {
      type: String,
      required: [true, "email is Required"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    phone: String,
    profileImg: String,

    password: {
      type: String,
      required: [true, "password is Required"],
      minLength: [6, "Too short password"],
    },
    passwordChanged: Date,
    hashedResetCode: String,
    hashedResetCodeExpire: Date,
    hashedResetCodeVerify: Boolean,
    role: {
      type: String,
      enum: ["user", "manger", "admin"],
      default: "user",
    },
    active: {
      type: Boolean,
      default: true,
    },
    // child ref (one to Many ::: no3 el db) w de benstkhdmha lama yekon el 3adad hayb2a 2olyl
    wishList: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "product",
      },
    ],
    addresses: [
      {
        id: { type: mongoose.Schema.Types.ObjectId },
        alias: String,
        details: String,
        city: String,
        phone: String,
        postalCode: String,
      },
    ],
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
