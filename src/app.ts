import express from "express";
import type { IncomingMessage } from "http";
import morgan from "morgan";
import path from "path";

import { errorHandler, notFoundHandler } from "./middlewares/error.middleware";
import { registerAppMiddlewares } from "./middlewares/app.middleware";
import authRoutes from "./routes/auth";

const app = express();

registerAppMiddlewares(app);

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

const isProduction = process.env.NODE_ENV === "production";

app.use(
  morgan(isProduction ? "combined" : "dev", {
    skip: (req: IncomingMessage) => req.url?.startsWith("/health") ?? false,
  }),
);

app.use("/api/auth", authRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
