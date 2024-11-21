import mongoose from "mongoose";

const userScheme = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },
    phone: {
      type: String,
      require: true,
      unique: true,
      trim: true,
      maxLength: 10,
    },
    username: {
      type: String,
      require: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    email: {
      type: String,
      require: true,
      unique: true,
    },
    password: {
      type: String,
      require: true,
      minLength: 6,
    },
    avatar: {
      type: String,
      default: "",
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },
    dob: {
      require: true,
      type: String,
    },
    role: {
      type: String,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
userScheme.index({ username: 1, email: 1, phone: 1 });
export default mongoose.model("Users", userScheme);
