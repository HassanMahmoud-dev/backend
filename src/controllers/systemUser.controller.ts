import { RequestHandler } from "express";
import { BaseCrudController } from "../bases/base.controller";
import { SystemUser } from "../models/systemUser.model";
import { systemUserService } from "../services/systemUser.service";

export class SystemUserController extends BaseCrudController<SystemUser> {
  constructor() {
    super(systemUserService);
  }

  public override create: RequestHandler = this.execute(async (req, res) => {
    const data = { ...req.body };
    if (req.file) {
      // Store the relative path for the frontend
      data.AVATAR = `/uploads/profile/${req.file.filename}`;
    }
    const result = await this.service.create(data);
    this.created(res, result, "تمت الإضافة بنجاح");
  });

  public override update: RequestHandler = this.execute(async (req, res) => {
    const { id } = req.params;
    const data = { ...req.body };
    if (req.file) {
      // Store the relative path for the frontend
      data.AVATAR = `/uploads/profile/${req.file.filename}`;
    }
    const result = await this.service.update(id as string, data);
    if (this.validateResult(res, result, "لم يتم العثور على المستخدم أو فشل التحديث")) {
      this.ok(res, result, "تم التحديث بنجاح");
    }
  });
}

export const systemUserController = new SystemUserController();
