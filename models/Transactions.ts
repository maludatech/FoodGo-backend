import mongoose, { Schema, model, models } from "mongoose";

const transactionSchema = new Schema(
  {
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      default: null,
    },
    quantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      default: 0,
    },
    deliveryFee: {
      type: Number,
      default: 0,
    },
    tax: {
      type: Number,
      default: 0,
    },
    total: {
      type: Number,
      default: 0,
    },
    deliveryDate: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

const Transaction =
  models.Transaction || model("Transaction", transactionSchema);

export default Transaction;
