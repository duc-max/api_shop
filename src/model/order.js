import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  items: [{ productName: String, quantity: Number, price: Number }],
  totalAmount: { type: Number, required: true },
  address: { type: String, require: true },
  status: { type: String, required: true },
  paymentMethod: { type: String, required: true },
});

export default mongoose.model("Order", orderSchema);
