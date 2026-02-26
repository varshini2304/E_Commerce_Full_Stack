import { createPaymentIntent, verifyPayment } from "../services/paymentService.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createPayment = asyncHandler(async (req, res) => {
  const data = await createPaymentIntent(req.user._id, req.body.orderId);
  return sendSuccess(res, "Payment intent created", data, 201);
});

export const verifyPaymentController = asyncHandler(async (req, res) => {
  const data = await verifyPayment(req.body.transactionId, req.body.status);
  return sendSuccess(res, "Payment verified", data);
});
