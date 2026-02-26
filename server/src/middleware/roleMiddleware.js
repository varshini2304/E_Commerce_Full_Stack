import { ApiError } from "../utils/ApiError.js";

export const authorize =
  (...allowedRoles) =>
  (req, _res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      throw new ApiError("Forbidden", 403);
    }

    next();
  };
