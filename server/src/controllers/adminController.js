import { getDashboardSummary } from "../services/adminService.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getAdminDashboard = asyncHandler(async (_req, res) => {
  const data = await getDashboardSummary();
  return sendSuccess(res, "Admin dashboard fetched", data);
});
