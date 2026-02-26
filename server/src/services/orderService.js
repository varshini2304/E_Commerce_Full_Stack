import mongoose from "mongoose";
import { Cart } from "../models/Cart.js";
import { Order } from "../models/Order.js";
import { Product } from "../models/Product.js";
import { ApiError } from "../utils/ApiError.js";

export const createOrderFromCart = async (userId) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const cart = await Cart.findOne({ userId }).session(session);
    if (!cart || cart.items.length === 0) throw new ApiError("Cart is empty", 400);

    const productIds = cart.items.map((item) => item.productId);
    const products = await Product.find({ _id: { $in: productIds }, isActive: true }).session(
      session,
    );

    const productMap = new Map(products.map((product) => [String(product._id), product]));
    const items = [];

    for (const item of cart.items) {
      const product = productMap.get(String(item.productId));
      if (!product) throw new ApiError("Invalid cart product", 400);
      if (product.stock < item.quantity) throw new ApiError("Insufficient stock", 400);

      product.stock -= item.quantity;
      product.salesCount += item.quantity;
      await product.save({ session });

      items.push({
        productId: product._id,
        name: product.name,
        thumbnail: product.thumbnail,
        quantity: item.quantity,
        price: item.priceAtAddTime,
      });
    }

    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const order = await Order.create(
      [
        {
          userId,
          items,
          subtotal,
          total: subtotal,
        },
      ],
      { session },
    );

    cart.items = [];
    cart.totalAmount = 0;
    await cart.save({ session });

    await session.commitTransaction();
    return order[0].toObject();
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

export const getOrdersByUser = async (userId) =>
  Order.find({ userId }).sort({ createdAt: -1 }).lean();

export const getAllOrders = async () => Order.find().sort({ createdAt: -1 }).lean();

export const updateOrderStatus = async (id, status) => {
  const order = await Order.findById(id);
  if (!order) throw new ApiError("Order not found", 404);

  const transitions = {
    pending: ["processing"],
    processing: ["shipped"],
    shipped: ["delivered"],
    delivered: [],
    cancelled: [],
  };

  if (!transitions[order.status].includes(status) && order.status !== status) {
    throw new ApiError("Invalid status transition", 400);
  }

  order.status = status;
  await order.save();
  return order.toObject();
};
