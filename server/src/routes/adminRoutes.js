import { Router } from "express";
import { getAdminDashboard } from "../controllers/adminController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

export const adminRouter = Router();

adminRouter.get("/dashboard", protect, authorize("admin"), getAdminDashboard);
