import { Router } from "express";
import { getProfilePage } from "../controllers/profilePageController.js";

export const profilePageRouter = Router();

profilePageRouter.get("/", getProfilePage);
