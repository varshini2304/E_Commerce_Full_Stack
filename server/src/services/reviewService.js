import { Order } from "../models/Order.js";
import { Product } from "../models/Product.js";
import { Review } from "../models/Review.js";
import { ApiError } from "../utils/ApiError.js";

export const createReview = async (userId, payload) => {
  const hasPurchased = await Order.exists({
    userId,
    "items.productId": payload.productId,
    status: { $in: ["shipped", "delivered"] },
  });

  if (!hasPurchased) {
    throw new ApiError("You can review only purchased products", 403);
  }

  const review = await Review.findOneAndUpdate(
    { userId, productId: payload.productId },
    { rating: payload.rating, comment: payload.comment || "" },
    { new: true, upsert: true, runValidators: true },
  ).lean();

  const stats = await Review.aggregate([
    { $match: { productId: review.productId } },
    {
      $group: {
        _id: "$productId",
        ratingsAverage: { $avg: "$rating" },
        ratingsCount: { $sum: 1 },
      },
    },
  ]);

  if (stats[0]) {
    await Product.updateOne(
      { _id: review.productId },
      {
        ratingsAverage: Number(stats[0].ratingsAverage.toFixed(1)),
        ratingsCount: stats[0].ratingsCount,
      },
    );
  }

  return review;
};
