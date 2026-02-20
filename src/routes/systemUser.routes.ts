import { BaseCrudRoutes } from "../bases/base.routes";
import { systemUserController } from "../controllers/systemUser.controller";
import { authenticateToken, authorizeRole } from "../middlewares/auth.middleware";
import { SystemUser } from "../models/systemUser.model";
import { uploadProfile } from "../utils/upload";

class SystemUserRoutes extends BaseCrudRoutes<SystemUser> {
  constructor() {
    super(systemUserController, {
      middlewares: [authenticateToken, authorizeRole(["admin"])],
    });
  }

  protected override initializeRoutes(): void {
    const middlewares = this.options.middlewares || [];

    if (middlewares.length > 0) {
      this.router.use(middlewares);
    }

    this.router.get("/", systemUserController.findAll);
    this.router.get("/:id", systemUserController.findOne);

    // Security: Handle file upload through multer
    this.router.post("/", uploadProfile.single("AVATAR"), systemUserController.create);
    this.router.put("/:id", uploadProfile.single("AVATAR"), systemUserController.update);

    this.router.delete("/:id", systemUserController.delete);
  }
}

export default new SystemUserRoutes().router;
