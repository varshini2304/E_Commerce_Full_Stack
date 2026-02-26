import { Router } from "express";
import { createReviewController } from "../controllers/reviewController.js";
import { protect } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validationMiddleware.js";
import { createReviewValidator } from "../validators/reviewValidators.js";

export const reviewRouter = Router();

reviewRouter.post("/", protect, createReviewValidator, validate, createReviewController);
