import { body } from "express-validator";

export const createPaymentIntentValidator = [body("orderId").isMongoId()];

export const verifyPaymentValidator = [
  body("transactionId").isString().trim().notEmpty(),
  body("status").isIn(["succeeded", "failed"]),
];
