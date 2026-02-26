import crypto from "crypto";
import { Order } from "../models/Order.js";
import { Payment } from "../models/Payment.js";
import { ApiError } from "../utils/ApiError.js";

export const createPaymentIntent = async (userId, orderId) => {
  const order = await Order.findOne({ _id: orderId, userId }).lean();
  if (!order) throw new ApiError("Order not found", 404);

  const payment = await Payment.create({
    orderId,
    userId,
    amount: order.total,
    transactionId: crypto.randomUUID(),
    status: "pending",
  });

  return payment.toObject();
};

export const verifyPayment = async (transactionId, status) => {
  const payment = await Payment.findOne({ transactionId });
  if (!payment) throw new ApiError("Payment not found", 404);

  payment.status = status;
  await payment.save();

  const isPaid = status === "succeeded";
  await Order.updateOne(
    { _id: payment.orderId },
    { paymentStatus: isPaid ? "paid" : "failed", isPaid },
  );

  return payment.toObject();
};
