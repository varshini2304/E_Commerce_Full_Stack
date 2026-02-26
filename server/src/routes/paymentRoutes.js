import { Router } from "express";
import { createPayment, verifyPaymentController } from "../controllers/paymentController.js";
import { protect } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validationMiddleware.js";
import {
  createPaymentIntentValidator,
  verifyPaymentValidator,
} from "../validators/paymentValidators.js";

export const paymentRouter = Router();

paymentRouter.post("/create", protect, createPaymentIntentValidator, validate, createPayment);
paymentRouter.post("/verify", protect, verifyPaymentValidator, validate, verifyPaymentController);
