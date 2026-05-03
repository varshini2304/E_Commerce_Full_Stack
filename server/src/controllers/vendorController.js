import {
  createVendorProduct,
  deleteVendorProduct,
  getVendorInventory,
  getVendorProfile,
  listVendorProducts,
  loginVendor,
  registerVendor,
  updateVendorProduct,
} from "../services/vendorService.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const registerController = asyncHandler(async (req, res) => {
  const data = await registerVendor(req.body);
  return sendSuccess(res, "Vendor registered", data, 201);
});

export const loginController = asyncHandler(async (req, res) => {
  const data = await loginVendor(req.body);
  return sendSuccess(res, "Logged in", data);
});

export const profileController = asyncHandler(async (req, res) => {
  const data = await getVendorProfile(req.vendor._id);
  return sendSuccess(res, "Profile fetched", data);
});

export const listProductsController = asyncHandler(async (req, res) => {
  const { page, limit } = req.query;
  const data = await listVendorProducts(req.vendor._id, { page, limit });
  return sendSuccess(res, "Products fetched", data);
});

export const createProductController = asyncHandler(async (req, res) => {
  const data = await createVendorProduct(req.vendor._id, req.body);
  return sendSuccess(res, "Product created", data, 201);
});

export const updateProductController = asyncHandler(async (req, res) => {
  const data = await updateVendorProduct(req.vendor._id, req.params.id, req.body);
  return sendSuccess(res, "Product updated", data);
});

export const deleteProductController = asyncHandler(async (req, res) => {
  const data = await deleteVendorProduct(req.vendor._id, req.params.id);
  return sendSuccess(res, "Product deleted", data);
});

export const inventoryController = asyncHandler(async (req, res) => {
  const data = await getVendorInventory(req.vendor._id);
  return sendSuccess(res, "Inventory fetched", data);
});
