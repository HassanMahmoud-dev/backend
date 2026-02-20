import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { SystemUser } from "../models/systemUser.model";
import { RefreshToken } from "../models/refreshToken.model";
import { env } from "../config/env";
import path from "path";
import fs from "fs";
import { BaseService } from "../bases/base.service";

interface TokenPayload {
  userId: number;
  username: string;
  role: "admin" | "employee";
}

export class AuthService extends BaseService<SystemUser> {
  constructor() {
    super(SystemUser);
  }

  async login(username: string, password: string) {
    const user = await this.findOne({ USERNAME: username });

    if (!user) {
      throw new Error("USER_NOT_FOUND");
    }

    const isPasswordValid = await bcrypt.compare(password, user.PASSWORD);

    if (!isPasswordValid) {
      throw new Error("INVALID_PASSWORD");
    }

    const accessToken = jwt.sign(
      {
        userId: user.USER_ID,
        username: user.USERNAME,
        role: user.ROLE,
      },
      env.jwtSecret,
      { expiresIn: "15m" },
    );

    // Refresh token valid for 7 days
    const refreshTokenExpiresIn = 7 * 24 * 60 * 60 * 1000; // 7 days in ms
    const refreshToken = jwt.sign(
      {
        userId: user.USER_ID,
        username: user.USERNAME,
        role: user.ROLE,
      },
      env.jwtRefreshSecret,
      { expiresIn: "7d" },
    );

    // Store refresh token in database
    await RefreshToken.create({
      TOKEN: refreshToken,
      USER_ID: user.USER_ID,
      EXPIRES_AT: new Date(Date.now() + refreshTokenExpiresIn),
    });

    return {
      accessToken,
      refreshToken,
      user: {
        userId: user.USER_ID,
        username: user.USERNAME,
        fullName: user.FULL_NAME,
        avatar: user.AVATAR,
        role: user.ROLE,
      },
    };
  }

  async refreshToken(token: string) {
    if (!token) {
      throw new Error("Refresh token required");
    }

    // Find token in database
    const storedToken = await RefreshToken.findOne({ where: { TOKEN: token } });

    if (!storedToken) {
      throw new Error("Invalid refresh token");
    }

    // Check if expired in DB (double check alongside JWT verify)
    if (storedToken.EXPIRES_AT < new Date()) {
      await storedToken.destroy(); // Clean up expired token
      throw new Error("Refresh token expired");
    }

    try {
      const user = jwt.verify(token, env.jwtRefreshSecret) as TokenPayload;

      const accessToken = jwt.sign(
        {
          userId: user.userId,
          username: user.username,
          role: user.role,
        },
        env.jwtSecret,
        { expiresIn: "15m" },
      );

      return { accessToken };
    } catch {
      throw new Error("Invalid refresh token");
    }
  }

  async logout(token: string) {
    await RefreshToken.destroy({ where: { TOKEN: token } });
    return { message: "Logged out successfully" };
  }

  async updateProfile(
    userId: number,
    data: { fullName?: string; password?: string; avatar?: string | null },
  ) {
    const user = await this.model.findByPk(userId);

    if (!user) {
      throw new Error("User not found");
    }

    if (data.fullName) {
      user.FULL_NAME = data.fullName;
    }

    if (data.password) {
      user.PASSWORD = await bcrypt.hash(data.password, 10);
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
      user.AVATAR = data.avatar || null;
    }

    await user.save();

    return {
      userId: user.USER_ID,
      username: user.USERNAME,
      fullName: user.FULL_NAME,
      avatar: user.AVATAR,
      role: user.ROLE,
    };
  }
}

export const authService = new AuthService();
