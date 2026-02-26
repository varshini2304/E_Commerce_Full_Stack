import { User } from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";

export const getProfile = async (userId) => {
  const user = await User.findById(userId).select("-password").lean();
  if (!user) throw new ApiError("User not found", 404);
  return user;
};

export const updateProfile = async (userId, payload) => {
  const user = await User.findByIdAndUpdate(userId, payload, { new: true })
    .select("-password")
    .lean();
  if (!user) throw new ApiError("User not found", 404);
  return user;
};
