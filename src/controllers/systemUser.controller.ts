import { Request, Response } from "express";
import { systemUserService } from "../services/systemUser.service";
import { asyncHandler } from "../utils/asyncHandler.util";
import { sendSuccessResponse } from "../utils/response.util";
import { notFoundError, forbiddenError, conflictError } from "../utils/error.util";
import { AuthRequest } from "../middlewares/auth.middleware";
import { sessionService } from "../services/session.service";

export const findAll = asyncHandler(async (req: Request, res: Response) => {
  const { searchTerm, role, status, page, limit } = req.query;
  const result = await systemUserService.findAll({
    searchTerm: searchTerm as string,
    role: role as string,
    status: status as string,
    page: page ? parseInt(page as string) : 1,
    limit: limit ? parseInt(limit as string) : 50,
  });
  return sendSuccessResponse(res, "Success", result);
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

export const deleteUser = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params as { id: string };

  // Prevent user from deleting themselves
  if (req.user?.userId === parseInt(id)) {
    throw forbiddenError("لا يمكنك حذف حسابك الخاص");
  }

  const deletedCount = await systemUserService.delete(id);
  if (!deletedCount) {
    throw notFoundError("العنصر غير موجود");
  }
  return sendSuccessResponse(res, "تم الحذف بنجاح", null);
});

export const getConnectedUsers = asyncHandler(async (req: Request, res: Response) => {
  const result = await sessionService.getConnectedUsers();
  return sendSuccessResponse(res, "Success", result);
});

export const revokeSession = asyncHandler(async (req: Request, res: Response) => {
  const { tokenId } = req.params;
  const result = await sessionService.revokeSession(parseInt(tokenId as string));
  return sendSuccessResponse(res, "تم تسجيل خروج المستخدم من الجلسة", result);
});

export const systemUserController = {
  findAll,
  findOne,
  create,
  update,
  delete: deleteUser,
  getConnectedUsers,
  revokeSession,
};
