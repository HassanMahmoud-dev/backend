import type { NextFunction, Request, Response } from "express";
import { systemUserService } from "../services/systemUser.service";

export const findAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await systemUserService.findAll();
    return res.status(200).json({ success: true, message: "Success", data });
  } catch (error) {
    next(error);
  }
};

export const findOne = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const data = await systemUserService.findById(id as string);
    if (!data) {
      return res.status(404).json({ success: false, message: "Not Found", errors: null });
    }
    return res.status(200).json({ success: true, message: "Success", data });
  } catch (error) {
    next(error);
  }
};

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = { ...req.body };
    if (req.file) {
      data.AVATAR = `/uploads/profile/${req.file.filename}`;
    }
    const result = await systemUserService.create(data);
    return res.status(201).json({ success: true, message: "تمت الإضافة بنجاح", data: result });
  } catch (error) {
    next(error);
  }
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const data = { ...req.body };
    if (req.file) {
      data.AVATAR = `/uploads/profile/${req.file.filename}`;
    }
    const result = await systemUserService.update(id as string, data);
    if (!result) {
      return res.status(404).json({
        success: false,
        message: "لم يتم العثور على المستخدم أو فشل التحديث",
        errors: null,
      });
    }
    return res.status(200).json({ success: true, message: "تم التحديث بنجاح", data: result });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const deletedCount = await systemUserService.delete(id as string);
    if (!deletedCount) {
      return res.status(404).json({ success: false, message: "العنصر غير موجود", errors: null });
    }
    return res.status(200).json({ success: true, message: "تم الحذف بنجاح", data: null });
  } catch (error) {
    next(error);
  }
};

export const systemUserController = {
  findAll,
  findOne,
  create,
  update,
  delete: deleteUser,
};
