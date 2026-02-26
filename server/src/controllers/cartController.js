import {
  addItemToCart,
  getCartByUser,
  removeCartItem,
  updateCartItemQuantity,
} from "../services/cartService.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getCart = asyncHandler(async (req, res) => {
  const data = await getCartByUser(req.user._id);
  return sendSuccess(res, "Cart fetched", data);
});

export const addToCart = asyncHandler(async (req, res) => {
  const data = await addItemToCart(req.user._id, req.body.productId, req.body.quantity);
  return sendSuccess(res, "Item added to cart", data);
});

export const updateCart = asyncHandler(async (req, res) => {
  const data = await updateCartItemQuantity(req.user._id, req.body.productId, req.body.quantity);
  return sendSuccess(res, "Cart item updated", data);
});

export const removeCartItemController = asyncHandler(async (req, res) => {
  const data = await removeCartItem(req.user._id, req.params.productId);
  return sendSuccess(res, "Cart item removed", data);
});
