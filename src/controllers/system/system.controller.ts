import { Request, Response } from "express";
import { systemService } from "@/services/system/system.service";
import { healthService } from "@/services/system/health.service";
import { asyncHandler } from "@/utils/asyncHandler.util";
import { sendSuccessResponse } from "@/utils/response.util";

export const getApiRoutes = asyncHandler(async (req: Request, res: Response) => {
  // We need access to the app instance. It's available on req.app
  const routes = systemService.getAllRoutes(
    req.app as unknown as Parameters<typeof systemService.getAllRoutes>[0],
  );

  return sendSuccessResponse(res, "API routes retrieved successfully", routes);
});

export const getSystemMetrics = asyncHandler(async (_req: Request, res: Response) => {
  const metrics = await healthService.getSystemMetrics();
  return sendSuccessResponse(res, "System metrics retrieved successfully", metrics);
});

export const getFaults = asyncHandler(async (_req: Request, res: Response) => {
  const faults = systemService.getFaults();
  return sendSuccessResponse(res, "System faults retrieved successfully", faults);
});

export const systemController = {
  getApiRoutes,
  getSystemMetrics,
  getFaults,
};
