import { body } from "express-validator";

export const updateProfileValidator = [
  body("name").optional().isString().trim().isLength({ min: 2 }),
  body("email").optional().isEmail().normalizeEmail(),
];
