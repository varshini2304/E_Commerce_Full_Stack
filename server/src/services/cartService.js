import { Cart } from "../models/Cart.js";
import { Product } from "../models/Product.js";
import { ApiError } from "../utils/ApiError.js";

const calcTotal = (items) =>
  items.reduce((sum, item) => sum + item.priceAtAddTime * item.quantity, 0);

export const getCartByUser = async (userId) => {
  const cart =
    (await Cart.findOne({ userId }).populate("items.productId").lean()) ||
    (await Cart.create({ userId, items: [], totalAmount: 0 })).toObject();

  return cart;
};

export const addItemToCart = async (userId, productId, quantity) => {
  const product = await Product.findOne({ _id: productId, isActive: true }).lean();
  if (!product) throw new ApiError("Product not found", 404);
  if (product.stock < quantity) throw new ApiError("Insufficient stock", 400);

  const cart = await Cart.findOne({ userId });
  if (!cart) {
    return Cart.create({
      userId,
      items: [{ productId, quantity, priceAtAddTime: product.finalPrice }],
      totalAmount: product.finalPrice * quantity,
    });
  }

  const existing = cart.items.find((item) => String(item.productId) === String(productId));
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.items.push({ productId, quantity, priceAtAddTime: product.finalPrice });
  }

  cart.totalAmount = calcTotal(cart.items);
  await cart.save();
  return cart.toObject();
};

export const updateCartItemQuantity = async (userId, productId, quantity) => {
  const cart = await Cart.findOne({ userId });
  if (!cart) throw new ApiError("Cart not found", 404);

  const target = cart.items.find((item) => String(item.productId) === String(productId));
  if (!target) throw new ApiError("Item not in cart", 404);

  target.quantity = quantity;
  cart.totalAmount = calcTotal(cart.items);
  await cart.save();
  return cart.toObject();
};

export const removeCartItem = async (userId, productId) => {
  const cart = await Cart.findOne({ userId });
  if (!cart) throw new ApiError("Cart not found", 404);

  cart.items = cart.items.filter((item) => String(item.productId) !== String(productId));
  cart.totalAmount = calcTotal(cart.items);
  await cart.save();
  return cart.toObject();
};

export const clearCart = (userId) => Cart.updateOne({ userId }, { items: [], totalAmount: 0 });
