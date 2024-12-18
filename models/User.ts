import { Schema, model, models } from "mongoose";

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: [true, "Fullname is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: [true, "Email must be unique"],
    },
    imageUrl: {
      type: String,
      required: false,
      default: null,
    },
    deliveryAddress: {
      type: String,
      required: [true, "Delivery address is required"],
    },
    phoneNumber: {
      type: String,
      required: [true, "Phone Number is required"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    resetToken: {
      type: String,
      required: false,
      default: null,
    },
    resetTokenExpiry: {
      type: Date,
      required: false,
      default: null,
    },
  },
  { timestamps: true }
);

const User = models.User || model("User", userSchema);

export default User;
