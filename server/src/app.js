import compression from "compression";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import { apiRouter } from "./routes/index.js";
import { notFoundHandler } from "./middleware/notFoundMiddleware.js";
import { errorHandler } from "./middleware/errorMiddleware.js";

export const app = express();
app.set("trust proxy", 1);
app.disable("x-powered-by");

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: Number.parseInt(process.env.RATE_LIMIT_MAX || "200", 10),
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
    credentials: true,
  }),
);
app.use(helmet());
app.use(compression());
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));
app.use("/api", apiLimiter);

app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "OK",
    data: { status: "healthy" },
  });
});

app.use("/api", apiRouter);
app.use(notFoundHandler);
app.use(errorHandler);
