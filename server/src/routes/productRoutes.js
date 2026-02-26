import { Router } from "express";
import {
  createProductController,
  deleteProductController,
  getProduct,
  getProducts,
  updateProductController,
  updateProductStockController,
} from "../controllers/productController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";
import { validate } from "../middleware/validationMiddleware.js";
import {
  createProductValidator,
  listProductsValidator,
  updateStockValidator,
} from "../validators/productValidators.js";

export const productRouter = Router();

productRouter.get("/", listProductsValidator, validate, getProducts);
productRouter.get("/:slug", getProduct);
productRouter.post("/", protect, authorize("admin"), createProductValidator, validate, createProductController);
productRouter.put("/:id", protect, authorize("admin"), updateProductController);
productRouter.delete("/:id", protect, authorize("admin"), deleteProductController);
productRouter.put(
  "/:id/stock",
  protect,
  authorize("admin"),
  updateStockValidator,
  validate,
  updateProductStockController,
);
