import { getProfilePageData } from "../services/profilePageService.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getProfilePage = asyncHandler(async (req, res) => {
  const data = await getProfilePageData(req.query.email);
  return sendSuccess(res, "Profile page fetched", data);
});
