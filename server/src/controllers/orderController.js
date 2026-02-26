import {
  createOrderFromCart,
  getAllOrders,
  getOrdersByUser,
  updateOrderStatus,
} from "../services/orderService.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createOrder = asyncHandler(async (req, res) => {
  const data = await createOrderFromCart(req.user._id);
  return sendSuccess(res, "Order created", data, 201);
});

export const getMyOrders = asyncHandler(async (req, res) => {
  const data = await getOrdersByUser(req.user._id);
  return sendSuccess(res, "Orders fetched", data);
});

export const getOrders = asyncHandler(async (_req, res) => {
  const data = await getAllOrders();
  return sendSuccess(res, "All orders fetched", data);
});

export const updateOrderStatusController = asyncHandler(async (req, res) => {
  const data = await updateOrderStatus(req.params.id, req.body.status);
  return sendSuccess(res, "Order status updated", data);
});
