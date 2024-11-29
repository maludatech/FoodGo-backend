import mongoose, { Schema, model, models } from "mongoose";

const cardSchema = new Schema(
  {
    cardOwner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Card owner is required"],
    },
    cardNumber: {
      type: String,
      required: [true, "Card number is required"],
      validate: {
        validator: function (v: string) {
          // Allows only 13-19 digit card numbers
          return /^\d{13,19}$/.test(v);
        },
        message: "Card number must be 13-19 digits",
      },
    },
    cardExpiryDate: {
      type: String,
      required: [true, "Card expiry date is required"],
      validate: {
        validator: function (v: string) {
          // Matches MM/YY or MM/YYYY format
          return /^(0[1-9]|1[0-2])\/?([0-9]{2}|[0-9]{4})$/.test(v);
        },
        message: "Expiry date must be in MM/YY or MM/YYYY format",
      },
    },
    cardCVV: {
      type: String,
      required: [true, "Card CVV is required"],
      validate: {
        validator: function (v: string) {
          // CVV must be 3 or 4 digits
          return /^\d{3,4}$/.test(v);
        },
        message: "CVV must be 3 or 4 digits",
      },
    },
    cardType: {
      type: String,
      enum: {
        values: ["Visa", "MasterCard", "Amex", "Discover"],
        message: "Card type must be Visa, MasterCard, Amex, or Discover",
      },
      required: [true, "Card type is required"],
    },
  },
  { timestamps: true }
);

const Card = models.Card || model("Card", cardSchema);

export default Card;
