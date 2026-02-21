import bcrypt from "bcryptjs";
import { getNextId } from "../utils/ID";
import SystemUser from "../models/systemUser.model";
import { WhereOptions, Model, Op } from "sequelize";
import fs from "fs";
import path from "path";
import {
  getPaginationOptions,
  formatPaginatedResponse,
  PaginationResult,
} from "../utils/pagination.util";
import { getIO } from "./socket.service";

/** الواصفات الخاصة بالمستخدم لنظام TypeScript */
interface SystemUserAttributes {
  USER_ID: number;
  USERNAME: string;
  AVATAR: string | null;
  PASSWORD?: string;
  IS_ACTIVE?: string | null;
  LAST_LOGIN?: Date | null;
}

function deleteAvatarFile(avatarPath: string | null | undefined) {
  if (!avatarPath) return;
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

export async function findAll(
  filters: {
    searchTerm?: string;
    role?: string;
    status?: string;
    page?: number;
    limit?: number;
  } = {},
): Promise<PaginationResult<Model>> {
  const { searchTerm, role, status, page, limit } = filters;
  const where: Record<string | symbol, unknown> = {};

  if (searchTerm) {
    where[Op.or] = [
      { FULL_NAME: { [Op.like]: `%${searchTerm}%` } },
      { USERNAME: { [Op.like]: `%${searchTerm}%` } },
      { EMAIL: { [Op.like]: `%${searchTerm}%` } },
      { PHONE_NUMBER: { [Op.like]: `%${searchTerm}%` } },
    ];
  }

  if (role) {
    where.ROLE = role;
  }

  if (status) {
    where.IS_ACTIVE = status;
  }

  const paginationOptions = getPaginationOptions(page, limit);

  const { rows, count } = await SystemUser.findAndCountAll({
    where,
    attributes: { exclude: ["PASSWORD"] },
    order: [["CREATED_AT", "DESC"]],
    limit: paginationOptions.limit,
    offset: paginationOptions.offset,
  });

  return formatPaginatedResponse<Model>(
    rows as unknown as Model[],
    count,
    paginationOptions.page,
    paginationOptions.limit,
  );
}

export async function findById(id: string | number): Promise<Model | null> {
  return SystemUser.findByPk(id, {
    attributes: { exclude: ["PASSWORD"] },
  }) as unknown as Promise<Model | null>;
}

export async function findOne(where: WhereOptions): Promise<Model | null> {
  return SystemUser.findOne({ where }) as unknown as Promise<Model | null>;
}

export async function create(data: Record<string, unknown>): Promise<Model> {
  const existingUser = await findOne({ USERNAME: data.USERNAME as string });

  if (existingUser) {
    throw new Error("Username already exists");
  }

  const hashedPassword = await bcrypt.hash(data.PASSWORD as string, 10);
  const validId = await getNextId(SystemUser);

  const newUser = await SystemUser.create({
    ...data,
    USER_ID: validId,
    PASSWORD: hashedPassword,
    IS_ACTIVE: data.IS_ACTIVE || "on",
  });

  newUser.setDataValue("PASSWORD", undefined as unknown as string);
  return newUser;
}

export async function update(
  id: string | number,
  data: Record<string, unknown>,
): Promise<Model | null> {
  const oldUser = (await findById(id)) as unknown as (Model & SystemUserAttributes) | null;

  if (data.PASSWORD) {
    data.PASSWORD = await bcrypt.hash(data.PASSWORD as string, 10);
  }

  if (data.AVATAR === "") {
    data.AVATAR = null;
  }

  const [affectedCount] = await SystemUser.update(data, {
    where: {
      [SystemUser.primaryKeyAttribute]: id,
    } as WhereOptions,
  });

  let updatedUser: Model | null = null;
  if (affectedCount > 0) {
    updatedUser = await findById(id);
  }

  if (updatedUser && oldUser?.AVATAR) {
    if (data.AVATAR !== undefined && data.AVATAR !== oldUser.AVATAR) {
      deleteAvatarFile(oldUser.AVATAR);
    }
  }

  if (affectedCount > 0 && data.IS_ACTIVE === "off" && oldUser?.IS_ACTIVE !== "off") {
    try {
      getIO().to(`user_${id}`).emit("force_logout");
    } catch (e) {
      console.error(e);
    }
  }

  return updatedUser;
}

export async function deleteUser(id: string | number): Promise<number> {
  const user = (await findById(id)) as unknown as (Model & SystemUserAttributes) | null;

  const result = await SystemUser.destroy({
    where: {
      [SystemUser.primaryKeyAttribute]: id,
    } as WhereOptions,
  });

  if (result > 0 && user?.AVATAR) {
    deleteAvatarFile(user.AVATAR);
  }

  if (result > 0) {
    try {
      getIO().to(`user_${id}`).emit("force_logout");
    } catch (e) {
      console.error(e);
    }
  }

  return result;
}

export const systemUserService = {
  findAll,
  findById,
  findOne,
  create,
  update,
  delete: deleteUser,
};
