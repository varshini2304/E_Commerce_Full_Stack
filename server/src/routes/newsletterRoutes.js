import { Router } from "express";
import { sendSuccess } from "../utils/apiResponse.js";

export const newsletterRouter = Router();

newsletterRouter.post("/subscribe", (req, res) => {
  const email = req.body?.email || "";
  return sendSuccess(res, "Subscription received", { email }, 201);
});
