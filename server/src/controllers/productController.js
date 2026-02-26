import {
  createProduct,
  deleteProduct,
  getProductBySlug,
  listProducts,
  updateProduct,
  updateProductStock,
} from "../services/productService.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getProducts = asyncHandler(async (req, res) => {
  const data = await listProducts(req.query);
  return sendSuccess(res, "Products fetched", data);
});

export const getProduct = asyncHandler(async (req, res) => {
  const data = await getProductBySlug(req.params.slug);
  return sendSuccess(res, "Product fetched", data);
});

export const createProductController = asyncHandler(async (req, res) => {
  const data = await createProduct(req.body);
  return sendSuccess(res, "Product created", data, 201);
});

export const updateProductController = asyncHandler(async (req, res) => {
  const data = await updateProduct(req.params.id, req.body);
  return sendSuccess(res, "Product updated", data);
});

export const deleteProductController = asyncHandler(async (req, res) => {
  const data = await deleteProduct(req.params.id);
  return sendSuccess(res, "Product deleted", data);
});

export const updateProductStockController = asyncHandler(async (req, res) => {
  const data = await updateProductStock(req.params.id, req.body.stock);
  return sendSuccess(res, "Stock updated", data);
});
