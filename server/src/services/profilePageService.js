import { Order } from "../models/Order.js";
import { User } from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";

const DEFAULT_AVATAR_URL = "https://picsum.photos/seed/profile-avatar/220/220";

export const getProfilePageData = async (email) => {
  const userFilter = email ? { email: email.toLowerCase() } : { role: "customer" };

  const user = await User.findOne(userFilter).select("name email role").sort({ createdAt: 1 }).lean();
  if (!user) {
    throw new ApiError("User not found", 404);
  }

  const orders = await Order.find({ userId: user._id }).sort({ createdAt: -1 }).lean();

  return {
    user: {
      id: String(user._id),
      name: user.name,
      email: user.email,
      avatarUrl: DEFAULT_AVATAR_URL,
    },
    orders: orders.map((order) => ({
      id: String(order._id),
      orderNumber: String(order._id).slice(-5).toUpperCase(),
      status: order.status,
      subtotal: order.subtotal,
      total: order.total,
      createdAt: order.createdAt,
      items: order.items.map((item) => ({
        productId: String(item.productId),
        name: item.name,
        thumbnail: item.thumbnail,
        quantity: item.quantity,
        price: item.price,
      })),
    })),
  };
};
