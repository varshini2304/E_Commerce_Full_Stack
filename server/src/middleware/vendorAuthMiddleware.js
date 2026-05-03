import jwt from "jsonwebtoken";
import { Vendor } from "../models/Vendor.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const protectVendor = asyncHandler(async (req, _res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

  if (!token) {
    throw new ApiError("Unauthorized", 401);
  }

  const payload = jwt.verify(token, process.env.JWT_SECRET);

  if (payload.type !== "vendor" || !payload.vendorId) {
    throw new ApiError("Invalid vendor token", 401);
  }

  const vendor = await Vendor.findById(payload.vendorId).select("-password").lean();
  if (!vendor) {
    throw new ApiError("Vendor not found", 401);
  }

  req.vendor = vendor;
  next();
});
