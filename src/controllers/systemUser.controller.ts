import { Request, Response } from "express";
import { systemUserService } from "../services/systemUser.service";
import { asyncHandler } from "../utils/asyncHandler.util";
import { sendSuccessResponse } from "../utils/response.util";
import { notFoundError, conflictError } from "../utils/error.util";

export const findAll = asyncHandler(async (req: Request, res: Response) => {
  const data = await systemUserService.findAll();
  return sendSuccessResponse(res, "Success", data);
});

export const findOne = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = await systemUserService.findById(id as string);
  if (!data) {
    throw notFoundError("Not Found");
  }
  return sendSuccessResponse(res, "Success", data);
});

export const create = asyncHandler(async (req: Request, res: Response) => {
  const data = { ...req.body };
  if (req.file) {
    data.AVATAR = `/uploads/profile/${req.file.filename}`;
  }
  try {
    const result = await systemUserService.create(data);
    return sendSuccessResponse(res, "تمت الإضافة بنجاح", result, 201);
  } catch (error) {
    if (error instanceof Error && error.message === "Username already exists") {
      throw conflictError("اسم المستخدم موجود مسبقاً");
    }
    throw error;
  }
});

export const update = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = { ...req.body };
  if (req.file) {
    data.AVATAR = `/uploads/profile/${req.file.filename}`;
  }
  const result = await systemUserService.update(id as string, data);
  if (!result) {
    throw notFoundError("لم يتم العثور على المستخدم أو فشل التحديث");
  }
  return sendSuccessResponse(res, "تم التحديث بنجاح", result);
});

export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const deletedCount = await systemUserService.delete(id as string);
  if (!deletedCount) {
    throw notFoundError("العنصر غير موجود");
  }
  return sendSuccessResponse(res, "تم الحذف بنجاح", null);
});

export const systemUserController = {
  findAll,
  findOne,
  create,
  update,
  delete: deleteUser,
};
