import bcrypt from "bcryptjs";
import { Attributes, WhereOptions } from "sequelize";
import { BaseService } from "../bases/base.service";
import { getNextId } from "../utils/ID";
import { SystemUser, SystemUserCreationAttributes } from "../models/systemUser.model";
import fs from "fs";
import path from "path";

export class SystemUserService extends BaseService<SystemUser> {
  constructor() {
    super(SystemUser);
  }

  private deleteAvatarFile(avatarPath: string | null | undefined) {
    if (!avatarPath) return;
    // Check if it's a local file path (starts with /uploads)
    if (avatarPath.startsWith("/uploads")) {
      const fullPath = path.join(process.cwd(), avatarPath);
      if (fs.existsSync(fullPath)) {
        try {
          fs.unlinkSync(fullPath);
        } catch (err) {
          console.error(`Failed to delete avatar file: ${fullPath}`, err);
        }
      }
    }
  }

  async create(data: SystemUserCreationAttributes): Promise<SystemUser> {
    const existingUser = await this.findOne({ USERNAME: data.USERNAME });

    if (existingUser) {
      throw new Error("Username already exists");
    }

    const hashedPassword = await bcrypt.hash(data.PASSWORD!, 10);
    const validId = await getNextId(this.model);

    const newUser = await super.create({
      ...data,
      USER_ID: validId,
      PASSWORD: hashedPassword,
    });

    newUser.setDataValue("PASSWORD", undefined as unknown as string);
    return newUser;
  }

  async update(
    id: string | number,
    data: Partial<Attributes<SystemUser>>,
  ): Promise<SystemUser | null> {
    const oldUser = await this.findById(id);

    // If password provided, hash it
    if (data.PASSWORD) {
      data.PASSWORD = await bcrypt.hash(data.PASSWORD, 10);
    }

    // Handle empty string as null for AVATAR removal
    if (data.AVATAR === "") {
      data.AVATAR = null;
    }

    const updatedUser = await super.update(id, data);

    // If update succeeded, check if we need to delete the old avatar
    if (updatedUser && oldUser?.AVATAR) {
      // Delete old avatar if data.AVATAR is provided (meaning we intended to change or remove it)
      // And strict check against old value
      if (data.AVATAR !== undefined && data.AVATAR !== oldUser.AVATAR) {
        this.deleteAvatarFile(oldUser.AVATAR);
      }
    }

    return updatedUser;
  }

  async delete(id: string | number): Promise<number> {
    const user = await this.findById(id);
    const result = await super.delete(id);

    if (result > 0 && user?.AVATAR) {
      this.deleteAvatarFile(user.AVATAR);
    }

    return result;
  }

  async findAll(where?: WhereOptions<Attributes<SystemUser>>): Promise<SystemUser[]> {
    return this.model.findAll({
      where,
      attributes: { exclude: ["PASSWORD"] },
    });
  }

  async findById(id: string | number): Promise<SystemUser | null> {
    return this.model.findByPk(id, {
      attributes: { exclude: ["PASSWORD"] },
    });
  }
}

export const systemUserService = new SystemUserService();
