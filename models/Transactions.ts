import mongoose, { Schema, model, models } from "mongoose";

const transactionSchema = new Schema(
  {
    buyer: {
      id: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    name: {
      type: String,
      default: null,
    },
    quantity: {
      type: Number,
      default: null,
    },
    price: {
      type: Number,
      default: null,
    },
    deliveryFee: {
      type: Number,
      default: null,
    },
    tax: {
      type: Number,
      default: null,
    },
    total: {
      type: Number,
      default: null,
    },
  },
  { timestamps: true }
);

const Transaction =
  models.Transaction || model("Transaction", transactionSchema);

export default Transaction;
