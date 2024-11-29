import mongoose, { Schema, model, models } from "mongoose";

const transactionSchema = new Schema(
  {
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Buyer is required"],
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      minlength: [3, "Name must be at least 3 characters"],
    },
    imageUrl: {
      type: String,
      required: [true, "Image URL is required"],
      validate: {
        validator: function (v: string) {
          return /^https?:\/\/.+\.(jpg|jpeg|png|webp|gif)$/.test(v);
        },
        message: "Invalid image URL",
      },
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [1, "Quantity must be at least 1"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price must be at least 0"],
    },
    deliveryFee: {
      type: Number,
      min: [0, "Delivery fee must be at least 0"],
    },
    tax: {
      type: Number,
      min: [0, "Tax must be at least 0"],
    },
    total: {
      type: Number,
      required: [true, "Total is required"],
      min: [0, "Total must be at least 0"],
    },
    deliveryDate: {
      type: Date,
      required: [true, "Delivery date is required"],
    },
  },
  { timestamps: true }
);

const Transaction =
  models.Transaction || model("Transaction", transactionSchema);

export default Transaction;
