import { getProfile, updateProfile } from "../services/authService.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getProfileController = asyncHandler(async (req, res) => {
  const data = await getProfile(req.user._id);
  return sendSuccess(res, "Profile fetched", data);
});

export const updateProfileController = asyncHandler(async (req, res) => {
  const data = await updateProfile(req.user._id, req.body);
  return sendSuccess(res, "Profile updated", data);
});
