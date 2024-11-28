import mongoose, { Schema, model, models } from "mongoose";

const cardSchema = new Schema(
  {
    cardOwner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    cardNumber: {
      type: String,
      default: null,
    },
    cardExpiryDate: {
      type: String,
      default: null,
    },
    cardCVV: {
      type: String,
      default: null,
    },
    cardType: {
      type: String,
      enum: ["Visa", "MasterCard", "Amex", "Discover"],
      default: null,
    },
  },
  { timestamps: true }
);

const Card = models.Card || model("Card", cardSchema);

export default Card;
