import { createReview } from "../services/reviewService.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createReviewController = asyncHandler(async (req, res) => {
  const data = await createReview(req.user._id, req.body);
  return sendSuccess(res, "Review submitted", data, 201);
});
