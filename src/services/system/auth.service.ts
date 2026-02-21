import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import SystemUser from "../../models/system/systemUser.model";
import RefreshToken from "../../models/system/systemRefreshToken.model";
import { getNextId } from "../../utils/ID";
import path from "path";
import fs from "fs";
import { Model } from "sequelize";
import { getIO } from "./socket.service";

interface TokenPayload {
  userId: number;
  username: string;
  role: "admin" | "employee";
}

/** الواصفات الخاصة بالمستخدم لنظام TypeScript */
interface SystemUserAttributes {
  USER_ID: number;
  USERNAME: string;
  PASSWORD?: string;
  FULL_NAME?: string | null;
  EMAIL?: string | null;
  PHONE_NUMBER?: string | null;
  AVATAR?: string | null;
  ROLE?: string | null;
  IS_ACTIVE?: string | null;
  LAST_LOGIN?: Date | null;
}

/** الواصفات الخاصة بـ RefreshToken */
interface RefreshTokenAttributes {
  TOKEN_ID: number;
  TOKEN: string;
  USER_ID: number;
  EXPIRES_AT: Date;
}

export async function login(
  username: string,
  password: string,
  deviceInfo?: string,
  ipAddress?: string,
) {
  const user = (await SystemUser.findOne({ where: { USERNAME: username } })) as unknown as
    | (Model & SystemUserAttributes)
    | null;

  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }

  if (user.IS_ACTIVE !== "on") {
    throw new Error("ACCOUNT_INACTIVE");
  }

  const isPasswordValid = await bcrypt.compare(password, user.PASSWORD || "");

  if (!isPasswordValid) {
    throw new Error("INVALID_PASSWORD");
  }

  // Update last login time
  await user.update({ LAST_LOGIN: new Date() });

  const accessToken = jwt.sign(
    {
      userId: user.USER_ID,
      username: user.USERNAME,
      role: (user.ROLE as string) || "employee",
    },
    process.env.JWT_SECRET || "supersecret",
    { expiresIn: "15m" },
  );

  // Refresh token valid for 7 days
  const refreshTokenExpiresIn = 7 * 24 * 60 * 60 * 1000; // 7 days in ms
  const refreshToken = jwt.sign(
    {
      userId: user.USER_ID,
      username: user.USERNAME,
      role: (user.ROLE as string) || "employee",
    },
    process.env.JWT_REFRESH_SECRET || "supersecretrefresh",
    { expiresIn: "7d" },
  );

  // Store refresh token in database
  const validId = await getNextId(RefreshToken);
  await RefreshToken.create({
    TOKEN_ID: validId,
    TOKEN: refreshToken,
    USER_ID: user.USER_ID,
    EXPIRES_AT: new Date(Date.now() + refreshTokenExpiresIn),
    DEVICE_INFO: deviceInfo || null,
    IP_ADDRESS: ipAddress || null,
  });

  try {
    getIO().emit("sessions_updated");
  } catch {
    // Ignore if IO is not initialized
  }

  return {
    accessToken,
    refreshToken,
    user: {
      userId: user.USER_ID,
      username: user.USERNAME,
      fullName: user.FULL_NAME,
      email: user.EMAIL,
      phoneNumber: user.PHONE_NUMBER,
      avatar: user.AVATAR,
      role: user.ROLE,
    },
  };
}

export async function refreshTokenAuth(token: string) {
  if (!token) {
    throw new Error("Refresh token required");
  }

  // Find token in database
  const storedToken = (await RefreshToken.findOne({ where: { TOKEN: token } })) as unknown as
    | (Model & RefreshTokenAttributes)
    | null;

  if (!storedToken) {
    throw new Error("Invalid refresh token");
  }

  // Check if expired in DB (double check alongside JWT verify)
  if (storedToken.EXPIRES_AT < new Date()) {
    await storedToken.destroy(); // Clean up expired token
    throw new Error("Refresh token expired");
  }

  try {
    const user = jwt.verify(
      token,
      process.env.JWT_REFRESH_SECRET || "supersecretrefresh",
    ) as TokenPayload;

    const accessToken = jwt.sign(
      {
        userId: user.userId,
        username: user.username,
        role: user.role,
      },
      process.env.JWT_SECRET || "supersecret",
      { expiresIn: "15m" },
    );

    return { accessToken };
  } catch {
    throw new Error("Invalid refresh token");
  }
}

export async function logout(token: string) {
  await RefreshToken.destroy({ where: { TOKEN: token } });

  try {
    getIO().emit("sessions_updated");
  } catch {
    // Ignore if IO is not initialized
  }

  return { message: "Logged out successfully" };
}

export async function updateProfile(
  userId: number,
  data: {
    fullName?: string;
    password?: string;
    avatar?: string | null;
    phoneNumber?: string;
  },
) {
  const user = (await SystemUser.findByPk(userId)) as unknown as
    | (Model & SystemUserAttributes)
    | null;

  if (!user) {
    throw new Error("User not found");
  }

  if (data.fullName) {
    user.setDataValue("FULL_NAME" as keyof SystemUserAttributes, data.fullName);
  }

  if (data.phoneNumber !== undefined) {
    user.setDataValue("PHONE_NUMBER" as keyof SystemUserAttributes, data.phoneNumber);
  }

  if (data.password) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    user.setDataValue("PASSWORD" as keyof SystemUserAttributes, hashedPassword);
  }

  // Handle avatar change or removal
  if (data.avatar !== undefined) {
    // If user clearly wants to change/remove avatar, delete the old one if exists
    if (user.AVATAR) {
      // Construct absolute path. user.AVATAR is relative e.g., /uploads/profile/filename.ext
      const oldAvatarPath = path.join(process.cwd(), user.AVATAR.replace(/^\//, ""));
      if (fs.existsSync(oldAvatarPath)) {
        fs.unlinkSync(oldAvatarPath);
      }
    }

    // If data.avatar is null/empty, we are removing it. Otherwise updating it.
    user.setDataValue("AVATAR" as keyof SystemUserAttributes, data.avatar || null);
  }

  await user.save();

  return {
    userId: user.USER_ID,
    username: user.USERNAME,
    fullName: user.FULL_NAME,
    email: user.EMAIL,
    phoneNumber: user.PHONE_NUMBER,
    avatar: user.AVATAR,
    role: user.ROLE,
  };
}

export const authService = {
  login,
  refreshToken: refreshTokenAuth,
  logout,
  updateProfile,
};
