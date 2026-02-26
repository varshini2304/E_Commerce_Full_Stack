import { Router } from "express";
import {
  createOrder,
  getMyOrders,
  getOrders,
  updateOrderStatusController,
} from "../controllers/orderController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";
import { validate } from "../middleware/validationMiddleware.js";
import { updateOrderStatusValidator } from "../validators/orderValidators.js";

export const orderRouter = Router();

orderRouter.post("/", protect, createOrder);
orderRouter.get("/my", protect, getMyOrders);
orderRouter.get("/", protect, authorize("admin"), getOrders);
orderRouter.put(
  "/:id/status",
  protect,
  authorize("admin"),
  updateOrderStatusValidator,
  validate,
  updateOrderStatusController,
);
