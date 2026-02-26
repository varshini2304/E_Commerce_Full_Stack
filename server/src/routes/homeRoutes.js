import { Router } from "express";
import { getHome } from "../controllers/homeController.js";

export const homeRouter = Router();
homeRouter.get("/", getHome);
