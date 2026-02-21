import { Request, Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import { authService } from "../services/auth.service";
import { asyncHandler } from "../utils/asyncHandler.util";
import { sendSuccessResponse } from "../utils/response.util";
import { badRequestError, unauthorizedError } from "../utils/error.util";

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    throw badRequestError("اسم المستخدم وكلمة المرور مطلوبان");
  }

  const deviceInfo = req.headers["user-agent"] || "Unknown";
  const ipAddress = (req.headers["x-forwarded-for"] ||
    req.socket.remoteAddress ||
    "Unknown") as string;

  try {
    const result = await authService.login(username, password, deviceInfo, ipAddress);
    return sendSuccessResponse(res, "تم تسجيل الدخول بنجاح", result);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "USER_NOT_FOUND") {
        throw unauthorizedError("اسم المستخدم غير موجود");
      }
      if (error.message === "INVALID_PASSWORD") {
        throw unauthorizedError("كلمة المرور خاطئة");
      }
      if (error.message === "ACCOUNT_INACTIVE") {
        throw unauthorizedError("عفواً، هذا الحساب غير نشط حالياً");
      }
      throw unauthorizedError(error.message);
    }
    throw error;
  }
});

export const refreshToken = asyncHandler(async (req: Request, res: Response) => {
  const { refreshToken: refreshTokenVal } = req.body;

  if (!refreshTokenVal) {
    throw unauthorizedError("عفواً، انتهت الجلسة، يرجى تسجيل الدخول مرة أخرى");
  }

  try {
    const result = await authService.refreshToken(refreshTokenVal);
    return sendSuccessResponse(res, "Success", result);
  } catch (error) {
    if (error instanceof Error) {
      throw unauthorizedError(error.message);
    }
    throw error;
  }
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  const { refreshToken: refreshTokenVal } = req.body;

  if (!refreshTokenVal) {
    throw badRequestError("رمز التحديث مطلوب");
  }

  await authService.logout(refreshTokenVal);
  return sendSuccessResponse(res, "تم تسجيل الخروج بنجاح", null);
});

export const updateProfile = asyncHandler(async (req: Request, res: Response) => {
  const authReq = req as AuthRequest;
  if (!authReq.user) {
    throw unauthorizedError("غير مصرح");
  }

  const userId = authReq.user.userId;
  const { fullName, password, removeAvatar } = req.body;
  const data: { fullName?: string; password?: string; avatar?: string | null } = {};

  if (fullName) data.fullName = fullName;
  if (password) data.password = password;

  if (removeAvatar === "true") {
    data.avatar = null;
  }

  if (req.file) {
    data.avatar = `/uploads/profile/${req.file.filename}`;
  }

  const result = await authService.updateProfile(userId, data);
  return sendSuccessResponse(res, "تم تحديث الملف الشخصي بنجاح", result);
});

export const authController = {
  login,
  refreshToken,
  logout,
  updateProfile,
};
