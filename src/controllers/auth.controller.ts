import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import { authService } from "../services/auth.service";

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "اسم المستخدم وكلمة المرور مطلوبان",
        errors: null,
      });
    }

    const result = await authService.login(username, password);
    return res.status(200).json({
      success: true,
      message: "تم تسجيل الدخول بنجاح",
      data: result,
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "USER_NOT_FOUND") {
        return res
          .status(401)
          .json({ success: false, message: "اسم المستخدم غير موجود", errors: null });
      }
      if (error.message === "INVALID_PASSWORD") {
        return res.status(401).json({ success: false, message: "كلمة المرور خاطئة", errors: null });
      }
      return res.status(401).json({ success: false, message: error.message, errors: null });
    }
    return next(error);
  }
};

export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken: refreshTokenVal } = req.body;

    if (!refreshTokenVal) {
      return res.status(401).json({
        success: false,
        message: "عفواً، انتهت الجلسة، يرجى تسجيل الدخول مرة أخرى",
        errors: null,
      });
    }

    const result = await authService.refreshToken(refreshTokenVal);
    return res.status(200).json({
      success: true,
      message: "Success",
      data: result,
    });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(401).json({ success: false, message: error.message, errors: null });
    }
    return next(error);
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken: refreshTokenVal } = req.body;

    if (!refreshTokenVal) {
      return res.status(400).json({
        success: false,
        message: "رمز التحديث مطلوب",
        errors: null,
      });
    }

    await authService.logout(refreshTokenVal);
    return res.status(200).json({
      success: true,
      message: "تم تسجيل الخروج بنجاح",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authReq = req as AuthRequest;
    if (!authReq.user) {
      return res.status(401).json({ success: false, message: "غير مصرح", errors: null });
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
    return res.status(200).json({
      success: true,
      message: "تم تحديث الملف الشخصي بنجاح",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const authController = {
  login,
  refreshToken,
  logout,
  updateProfile,
};
