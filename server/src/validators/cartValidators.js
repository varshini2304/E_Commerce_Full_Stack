import { body } from "express-validator";

export const addToCartValidator = [
  body("productId").isMongoId(),
  body("quantity").isInt({ min: 1 }).toInt(),
];

export const updateCartValidator = [
  body("productId").isMongoId(),
  body("quantity").isInt({ min: 1 }).toInt(),
];
