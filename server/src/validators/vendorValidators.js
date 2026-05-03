import { body, query } from "express-validator";

export const registerValidator = [
  body("name").isString().trim().notEmpty().isLength({ max: 80 }),
  body("email").isEmail().normalizeEmail(),
  body("password").isString().isLength({ min: 6, max: 100 }),
  body("businessName").isString().trim().notEmpty().isLength({ max: 120 }),
];

export const loginValidator = [
  body("email").isEmail().normalizeEmail(),
  body("password").isString().notEmpty(),
];

export const listProductsValidator = [
  query("page").optional().isInt({ min: 1 }).toInt(),
  query("limit").optional().isInt({ min: 1, max: 100 }).toInt(),
];

export const createProductValidator = [
  body("name").isString().trim().notEmpty(),
  body("slug").isString().trim().notEmpty(),
  body("description").isString().trim().notEmpty(),
  body("brand").optional().isString().trim(),
  body("price").isFloat({ min: 0 }).toFloat(),
  body("discountPercentage").optional().isFloat({ min: 0, max: 100 }).toFloat(),
  body("finalPrice").isFloat({ min: 0 }).toFloat(),
  body("stock").isInt({ min: 0 }).toInt(),
  body("sku").isString().trim().notEmpty(),
  body("categorySlug").isString().trim().notEmpty(),
  body("thumbnail").isURL(),
  body("images").optional().isArray(),
  body("tags").optional().isArray(),
];

export const updateProductValidator = [
  body("name").optional().isString().trim().notEmpty(),
  body("slug").optional().isString().trim().notEmpty(),
  body("description").optional().isString().trim().notEmpty(),
  body("brand").optional().isString().trim(),
  body("price").optional().isFloat({ min: 0 }).toFloat(),
  body("discountPercentage").optional().isFloat({ min: 0, max: 100 }).toFloat(),
  body("finalPrice").optional().isFloat({ min: 0 }).toFloat(),
  body("stock").optional().isInt({ min: 0 }).toInt(),
  body("sku").optional().isString().trim().notEmpty(),
  body("categorySlug").optional().isString().trim().notEmpty(),
  body("thumbnail").optional().isURL(),
  body("images").optional().isArray(),
  body("tags").optional().isArray(),
];
