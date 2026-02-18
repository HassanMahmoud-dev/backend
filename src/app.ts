import express from "express";
import type { IncomingMessage } from "http";
import morgan from "morgan";

import { errorHandler, notFoundHandler } from "./middlewares/error.middleware";
import { registerAppMiddlewares } from "./middlewares/app.middleware";
import healthRouter from "./routes/health.route";

const app = express();

registerAppMiddlewares(app);

const isProduction = process.env.NODE_ENV === "production";

app.use(
	morgan(isProduction ? "combined" : "dev", {
			skip: (req: IncomingMessage) => req.url?.startsWith("/health") ?? false,
	}),
);

app.use(healthRouter);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
