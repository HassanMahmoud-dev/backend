import bcrypt from "bcryptjs";
import { Attributes, WhereOptions } from "sequelize";
import { getNextId } from "../utils/ID";
import { SystemUser, SystemUserCreationAttributes } from "../models/systemUser.model";
import fs from "fs";
import path from "path";

function deleteAvatarFile(avatarPath: string | null | undefined) {
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

export async function findAll(where?: WhereOptions<Attributes<SystemUser>>): Promise<SystemUser[]> {
  return SystemUser.findAll({
    where,
    attributes: { exclude: ["PASSWORD"] },
  });
}

export async function findById(id: string | number): Promise<SystemUser | null> {
  return SystemUser.findByPk(id, {
    attributes: { exclude: ["PASSWORD"] },
  });
}

export async function findOne(
  where: WhereOptions<Attributes<SystemUser>>,
): Promise<SystemUser | null> {
  return SystemUser.findOne({ where });
}

export async function create(data: SystemUserCreationAttributes): Promise<SystemUser> {
  const existingUser = await findOne({ USERNAME: data.USERNAME });

  if (existingUser) {
    throw new Error("Username already exists");
  }

  const hashedPassword = await bcrypt.hash(data.PASSWORD!, 10);
  const validId = await getNextId(SystemUser);

  const newUser = await SystemUser.create({
    ...data,
    USER_ID: validId,
    PASSWORD: hashedPassword,
  });

  newUser.setDataValue("PASSWORD", undefined as unknown as string);
  return newUser;
}

export async function update(
  id: string | number,
  data: Partial<Attributes<SystemUser>>,
): Promise<SystemUser | null> {
  const oldUser = await findById(id);

  // If password provided, hash it
  if (data.PASSWORD) {
    data.PASSWORD = await bcrypt.hash(data.PASSWORD, 10);
  }

  // Handle empty string as null for AVATAR removal
  if (data.AVATAR === "") {
    data.AVATAR = null;
  }

  const [affectedCount] = await SystemUser.update(data, {
    where: {
      [SystemUser.primaryKeyAttribute]: id,
    } as WhereOptions<Attributes<SystemUser>>,
  });

  let updatedUser: SystemUser | null = null;
  if (affectedCount > 0) {
    updatedUser = await findById(id);
  }

  // If update succeeded, check if we need to delete the old avatar
  if (updatedUser && oldUser?.AVATAR) {
    // Delete old avatar if data.AVATAR is provided (meaning we intended to change or remove it)
    // And strict check against old value
    if (data.AVATAR !== undefined && data.AVATAR !== oldUser.AVATAR) {
      deleteAvatarFile(oldUser.AVATAR);
    }
  }

  return updatedUser;
}

export async function deleteUser(id: string | number): Promise<number> {
  const user = await findById(id);

  const result = await SystemUser.destroy({
    where: {
      [SystemUser.primaryKeyAttribute]: id,
    } as WhereOptions<Attributes<SystemUser>>,
  });

  if (result > 0 && user?.AVATAR) {
    deleteAvatarFile(user.AVATAR);
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
