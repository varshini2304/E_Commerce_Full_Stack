import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const protect = asyncHandler(async (req, _res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

  if (!token) {
    throw new ApiError("Unauthorized", 401);
  }

  const payload = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(payload.userId).select("-password").lean();

  if (!user) {
    throw new ApiError("User not found", 401);
  }

  req.user = user;
  next();
});
