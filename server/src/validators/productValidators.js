import { body, query } from "express-validator";

export const listProductsValidator = [
  query("page").optional().isInt({ min: 1 }).toInt(),
  query("limit").optional().isInt({ min: 1, max: 100 }).toInt(),
  query("minPrice").optional().isFloat({ min: 0 }).toFloat(),
  query("maxPrice").optional().isFloat({ min: 0 }).toFloat(),
  query("rating").optional().isFloat({ min: 0, max: 5 }).toFloat(),
];

export const createProductValidator = [
  body("name").isString().trim().notEmpty(),
  body("slug").isString().trim().notEmpty(),
  body("description").isString().trim().notEmpty(),
  body("price").isFloat({ min: 0 }).toFloat(),
  body("discountPercentage").optional().isFloat({ min: 0, max: 100 }).toFloat(),
  body("finalPrice").isFloat({ min: 0 }).toFloat(),
  body("stock").isInt({ min: 0 }).toInt(),
  body("sku").isString().trim().notEmpty(),
  body("categorySlug").isString().trim().notEmpty(),
  body("thumbnail").isURL(),
];

export const updateStockValidator = [body("stock").isInt({ min: 0 }).toInt()];
