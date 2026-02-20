import { Request, Response, RequestHandler } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import { authService, AuthService } from "../services/auth.service";
import { BaseController } from "../bases/base.controller";

export class AuthController extends BaseController {
  constructor(private readonly service: AuthService) {
    super();
  }

  public login: RequestHandler = this.execute(async (req: Request, res: Response) => {
    const { username, password } = req.body;

    if (!username || !password) {
      this.fail(res, "اسم المستخدم وكلمة المرور مطلوبان");
      return;
    }

    try {
      const result = await this.service.login(username, password);
      this.ok(res, result, "تم تسجيل الدخول بنجاح");
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "USER_NOT_FOUND") {
          this.fail(res, "اسم المستخدم غير موجود", 401);
          return;
        }
        if (error.message === "INVALID_PASSWORD") {
          this.fail(res, "كلمة المرور خاطئة", 401);
          return;
        }
        this.fail(res, error.message, 401);
        return;
      }
      this.fail(res, "فشل تسجيل الدخول", 401);
    }
  });

  public refreshToken: RequestHandler = this.execute(async (req: Request, res: Response) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      this.fail(res, "عفواً، انتهت الجلسة، يرجى تسجيل الدخول مرة أخرى", 401);
      return;
    }

    try {
      const result = await this.service.refreshToken(refreshToken);
      this.ok(res, result);
    } catch (error) {
      if (error instanceof Error) {
        this.fail(res, error.message, 401);
      } else {
        this.fail(res, "رمز تحديث غير صالح", 401);
      }
    }
  });

  public logout: RequestHandler = this.execute(async (req: Request, res: Response) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      this.fail(res, "رمز التحديث مطلوب");
      return;
    }

    await this.service.logout(refreshToken);
    this.ok(res, null, "تم تسجيل الخروج بنجاح");
  });

  public updateProfile: RequestHandler = this.execute(async (req: Request, res: Response) => {
    const authReq = req as AuthRequest;
    if (!authReq.user) {
      this.fail(res, "غير مصرح", 401);
      return;
    }

    const userId = authReq.user.userId;
    const { fullName, password, removeAvatar } = req.body;
    const data: { fullName?: string; password?: string; avatar?: string | null } = {};

    if (fullName) data.fullName = fullName;
    if (password) data.password = password;

    // If explicit remove requested
    if (removeAvatar === "true") {
      data.avatar = null;
    }

    if (req.file) {
      data.avatar = `/uploads/profile/${req.file.filename}`;
    }

    const result = await this.service.updateProfile(userId, data);
    this.ok(res, result, "تم تحديث الملف الشخصي بنجاح");
  });
}

export const authController = new AuthController(authService);
