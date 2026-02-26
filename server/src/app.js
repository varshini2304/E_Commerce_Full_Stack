import cors from "cors";
import express from "express";
import morgan from "morgan";
import { apiRouter } from "./routes/index.js";
import { notFoundHandler } from "./middleware/notFoundMiddleware.js";
import { errorHandler } from "./middleware/errorMiddleware.js";

export const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));

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
