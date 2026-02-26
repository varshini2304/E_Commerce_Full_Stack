import { body } from "express-validator";

export const createReviewValidator = [
  body("productId").isMongoId(),
  body("rating").isInt({ min: 1, max: 5 }).toInt(),
  body("comment").optional().isString(),
];
