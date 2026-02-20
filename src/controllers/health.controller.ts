import { Request, Response, NextFunction } from "express";
import { healthService } from "@/services/health.service";

export const getSystemHealth = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const status = healthService.getSystemStatus();
    return res.status(200).json({
      success: true,
      message: "Success",
      data: status,
    });
  } catch (error) {
    next(error);
  }
};

export const getDatabaseHealth = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const status = await healthService.getDatabaseStatus();
    if (status.ok) {
      return res.status(200).json({
        success: true,
        message: "Success",
        data: status,
      });
    } else {
      return res.status(503).json({
        success: false,
        message: "Database health check failed",
        errors: null,
        meta: status,
      });
    }
  } catch (error) {
    next(error);
  }
};

export const healthController = {
  getSystemHealth,
  getDatabaseHealth,
};
