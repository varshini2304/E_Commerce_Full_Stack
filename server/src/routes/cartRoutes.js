import { Router } from "express";
import {
  addToCart,
  getCart,
  removeCartItemController,
  updateCart,
} from "../controllers/cartController.js";
import { protect } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validationMiddleware.js";
import { addToCartValidator, updateCartValidator } from "../validators/cartValidators.js";

export const cartRouter = Router();

cartRouter.use(protect);
cartRouter.get("/", getCart);
cartRouter.post("/add", addToCartValidator, validate, addToCart);
cartRouter.put("/update", updateCartValidator, validate, updateCart);
cartRouter.delete("/remove/:productId", removeCartItemController);
