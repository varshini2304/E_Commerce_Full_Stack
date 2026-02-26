import { getHomePageData } from "../services/homeService.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getHome = asyncHandler(async (_req, res) => {
  const data = await getHomePageData();
  return sendSuccess(res, "Home fetched", data);
});
