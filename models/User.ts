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
      required: [true, "ImageUrl is required"],
    },
    deliveryAddress: {
      type: String,
      required: false,
      default: null,
    },
  },
  { timestamps: true }
);

const User = models.User || model("User", userSchema);

export default User;
