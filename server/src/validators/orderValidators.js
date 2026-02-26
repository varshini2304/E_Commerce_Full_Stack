import { body } from "express-validator";

export const updateOrderStatusValidator = [
  body("status").isIn(["pending", "processing", "shipped", "delivered", "cancelled"]),
];
