import { Router } from "express";

import { testOracleConnection } from "@/config/database";

const healthRouter = Router();

healthRouter.get("/health", (_req, res) => {
  res.status(200).json({
    ok: true,
    service: "backend",
    timestamp: new Date().toISOString(),
  });
});

healthRouter.get("/health/db", async (_req, res) => {
  const isConnected = await testOracleConnection();

  if (!isConnected) {
    res.status(503).json({
      ok: false,
      database: "oracle",
      message: "Database connection failed",
      timestamp: new Date().toISOString(),
    });
    return;
  }

  res.status(200).json({
    ok: true,
    database: "oracle",
    timestamp: new Date().toISOString(),
  });
});

export default healthRouter;
