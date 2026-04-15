import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true, index: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    amount: { type: Number, required: true, min: 0 },
    provider: { type: String, default: "demo" },
    status: { type: String, enum: ["pending", "paid", "failed"], default: "pending" },
    transactionId: { type: String, required: true, unique: true, index: true },
  },
  { timestamps: true },
);

export const Payment = mongoose.model("Payment", paymentSchema);

