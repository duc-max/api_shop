import mongoose from "mongoose";

const cartSchema = mongoose.Schema({
  productName: {
    type: String,
    require: true,
  },
  images: {
    type: String,
    require: true,
  },
  price: {
    type: Number,
    require: true,
  },
  quantity: {
    type: Number,
    require: true,
  },
  subTotal: {
    type: Number,
    require: true,
  },
  productId: {
    type: String,
    require: true,
  },
  userId: {
    type: String,
    require: true,
  },
});

export default mongoose.model("Cart", cartSchema);
