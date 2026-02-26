import { Router } from "express";
import { adminRouter } from "./adminRoutes.js";
import { authRouter } from "./authRoutes.js";
import { cartRouter } from "./cartRoutes.js";
import { homeRouter } from "./homeRoutes.js";
import { orderRouter } from "./orderRoutes.js";
import { paymentRouter } from "./paymentRoutes.js";
import { productRouter } from "./productRoutes.js";
import { reviewRouter } from "./reviewRoutes.js";
import { newsletterRouter } from "./newsletterRoutes.js";
import { profilePageRouter } from "./profilePageRoutes.js";

export const apiRouter = Router();

apiRouter.use("/home", homeRouter);
apiRouter.use("/products", productRouter);
apiRouter.use("/cart", cartRouter);
apiRouter.use("/orders", orderRouter);
apiRouter.use("/payments", paymentRouter);
apiRouter.use("/reviews", reviewRouter);
apiRouter.use("/auth", authRouter);
apiRouter.use("/admin", adminRouter);
apiRouter.use("/newsletter", newsletterRouter);
apiRouter.use("/profile-page", profilePageRouter);
