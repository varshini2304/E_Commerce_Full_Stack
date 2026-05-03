import { Router } from "express";
import {
  createProductController,
  deleteProductController,
  inventoryController,
  listProductsController,
  loginController,
  profileController,
  registerController,
  updateProductController,
} from "../controllers/vendorController.js";
import { protectVendor } from "../middleware/vendorAuthMiddleware.js";
import { validate } from "../middleware/validationMiddleware.js";
import {
  createProductValidator,
  listProductsValidator,
  loginValidator,
  registerValidator,
  updateProductValidator,
} from "../validators/vendorValidators.js";

export const vendorRouter = Router();

vendorRouter.post("/register", registerValidator, validate, registerController);
vendorRouter.post("/login", loginValidator, validate, loginController);

vendorRouter.get("/profile", protectVendor, profileController);

vendorRouter.get("/products", protectVendor, listProductsValidator, validate, listProductsController);
vendorRouter.post("/products", protectVendor, createProductValidator, validate, createProductController);
vendorRouter.put("/products/:id", protectVendor, updateProductValidator, validate, updateProductController);
vendorRouter.delete("/products/:id", protectVendor, deleteProductController);

vendorRouter.get("/inventory", protectVendor, inventoryController);
