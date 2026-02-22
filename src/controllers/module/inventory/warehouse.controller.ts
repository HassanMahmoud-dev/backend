import { Request, Response } from "express";
import { warehouseService } from "@/services/module/inventory/warehouse.service";
import { asyncHandler } from "@/utils/asyncHandler.util";
import { sendSuccessResponse } from "@/utils/response.util";
import { conflictError, notFoundError } from "@/utils/error.util";
import { AuthRequest } from "@/middlewares/auth.middleware";

export const findAll = asyncHandler(async (req: Request, res: Response) => {
  const { searchTerm, status, page, limit } = req.query;

  const result = await warehouseService.findAll({
    searchTerm: searchTerm as string,
    status: status as string,
    page: page ? parseInt(page as string) : 1,
    limit: limit ? parseInt(limit as string) : 50,
  });

  return sendSuccessResponse(res, "Success", result);
});

export const findOne = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = await warehouseService.findById(id as string);

  if (!data) {
    throw notFoundError("المخزن غير موجود");
  }

  return sendSuccessResponse(res, "Success", data);
});

export const create = asyncHandler(async (req: AuthRequest, res: Response) => {
  const payload = {
    ...req.body,
    CREATED_BY: req.user?.username,
    UPDATED_BY: null,
  };

  try {
    const result = await warehouseService.create(payload, req.user?.username);
    return sendSuccessResponse(res, "تمت إضافة المخزن بنجاح", result, 201);
  } catch (error) {
    if (error instanceof Error && error.message === "WAREHOUSE_CODE_EXISTS") {
      throw conflictError("كود المخزن مستخدم مسبقاً");
    }
    throw error;
  }
});

export const update = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const payload = {
    ...req.body,
    UPDATED_BY: req.user?.username,
  };

  try {
    const result = await warehouseService.update(id as string, payload, req.user?.username);

    if (!result) {
      throw notFoundError("المخزن غير موجود");
    }

    return sendSuccessResponse(res, "تم تحديث المخزن بنجاح", result);
  } catch (error) {
    if (error instanceof Error && error.message === "WAREHOUSE_CODE_EXISTS") {
      throw conflictError("كود المخزن مستخدم مسبقاً");
    }
    throw error;
  }
});

export const deleteWarehouse = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const deletedCount = await warehouseService.delete(id as string);

  if (!deletedCount) {
    throw notFoundError("المخزن غير موجود");
  }

  return sendSuccessResponse(res, "تم حذف المخزن بنجاح", null);
});

export const warehouseController = {
  findAll,
  findOne,
  create,
  update,
  delete: deleteWarehouse,
};
