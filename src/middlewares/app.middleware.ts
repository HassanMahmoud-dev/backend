import cors from "cors";
import express, { Express } from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";

import { env } from "@/config/env";

export const registerAppMiddlewares = (app: Express): void => {
  app.use(helmet());
  app.use(
    cors({
      origin: env.isWildcardCors ? true : env.corsOrigin,
      credentials: !env.isWildcardCors,
    }),
  );
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(
    rateLimit({
      windowMs: env.rateLimitWindowMs,
      max: env.rateLimitMax,
      standardHeaders: true,
      legacyHeaders: false,
    }),
  );
};
