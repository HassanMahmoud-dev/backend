import { authController, AuthController } from "../controllers/auth.controller";
import { BaseRoutes } from "../bases/base.routes";
import { authenticateToken } from "../middlewares/auth.middleware";
import { uploadProfile } from "../utils/upload";

export class AuthRoutes extends BaseRoutes {
  constructor(private readonly controller: AuthController) {
    super();
    this.initializeRoutes();
  }

  protected initializeRoutes(): void {
    this.router.post("/login", this.controller.login);
    this.router.post("/refresh-token", this.controller.refreshToken);
    this.router.post("/logout", this.controller.logout);
    this.router.put(
      "/profile",
      authenticateToken,
      uploadProfile.single("AVATAR"),
      this.controller.updateProfile,
    );
  }
}

export const authRoutes = new AuthRoutes(authController);
export default authRoutes.router;
