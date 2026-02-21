import { Request, Response } from "express";
import { healthService } from "@/services/system/health.service";
import { asyncHandler } from "@/utils/asyncHandler.util";
import { sendSuccessResponse, sendErrorResponse } from "@/utils/response.util";

export const getSystemHealth = asyncHandler(async (_req: Request, res: Response) => {
  const status = healthService.getSystemStatus();
  return sendSuccessResponse(res, "Success", status);
});

export const getDatabaseHealth = asyncHandler(async (_req: Request, res: Response) => {
  const status = await healthService.getDatabaseStatus();
  if (status.ok) {
    return sendSuccessResponse(res, "Success", status);
  } else {
    return sendErrorResponse(res, "Database health check failed", status, 503);
  }
});

export const healthController = {
  getSystemHealth,
  getDatabaseHealth,
};
