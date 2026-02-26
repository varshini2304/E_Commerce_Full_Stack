import { Router } from "express";
import {
  getProfileController,
  updateProfileController,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validationMiddleware.js";
import { updateProfileValidator } from "../validators/authValidators.js";

export const authRouter = Router();

authRouter.get("/profile", protect, getProfileController);
authRouter.put("/profile", protect, updateProfileValidator, validate, updateProfileController);
