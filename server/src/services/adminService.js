import { Order } from "../models/Order.js";
import { Product } from "../models/Product.js";

export const getDashboardSummary = async () => {
  const [orderStats, totalProducts, lowStockProducts] = await Promise.all([
    Order.aggregate([
      { $match: { isPaid: true } },
      { $group: { _id: null, totalRevenue: { $sum: "$total" }, totalOrders: { $sum: 1 } } },
    ]),
    Product.countDocuments({ isActive: true }),
    Product.find({ isActive: true, stock: { $lte: 10 } })
      .select("name slug stock finalPrice")
      .limit(10)
      .lean(),
  ]);

  return {
    totalRevenue: orderStats[0]?.totalRevenue || 0,
    totalOrders: orderStats[0]?.totalOrders || 0,
    totalProducts,
    lowStockProducts,
  };
};
