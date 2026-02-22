import { Request, Response } from "express";
import { itemCardService } from "@/services/module/inventory/itemCard.service";
import { asyncHandler } from "@/utils/asyncHandler.util";
import { sendSuccessResponse } from "@/utils/response.util";
import { conflictError, notFoundError } from "@/utils/error.util";
import { AuthRequest } from "@/middlewares/auth.middleware";

export const findAll = asyncHandler(async (req: Request, res: Response) => {
  const { searchTerm, category, status, page, limit } = req.query;

  const result = await itemCardService.findAll({
    searchTerm: searchTerm as string,
    category: category as string,
    status: status as string,
    page: page ? parseInt(page as string) : 1,
    limit: limit ? parseInt(limit as string) : 50,
  });

  return sendSuccessResponse(res, "Success", result);
});

export const findOne = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = await itemCardService.findById(id as string);

  if (!data) {
    throw notFoundError("كرت الصنف غير موجود");
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
    const result = await itemCardService.create(payload, req.user?.username);
    return sendSuccessResponse(res, "تمت إضافة كرت الصنف بنجاح", result, 201);
  } catch (error) {
    if (error instanceof Error && error.message === "ITEM_CODE_EXISTS") {
      throw conflictError("كود الصنف مستخدم مسبقاً");
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
    const result = await itemCardService.update(id as string, payload, req.user?.username);

    if (!result) {
      throw notFoundError("كرت الصنف غير موجود");
    }

    return sendSuccessResponse(res, "تم تحديث كرت الصنف بنجاح", result);
  } catch (error) {
    if (error instanceof Error && error.message === "ITEM_CODE_EXISTS") {
      throw conflictError("كود الصنف مستخدم مسبقاً");
    }
    throw error;
  }
});

export const deleteItemCard = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const deletedCount = await itemCardService.delete(id as string);

  if (!deletedCount) {
    throw notFoundError("كرت الصنف غير موجود");
  }

  return sendSuccessResponse(res, "تم حذف كرت الصنف بنجاح", null);
});

export const itemCardController = {
  findAll,
  findOne,
  create,
  update,
  delete: deleteItemCard,
};
