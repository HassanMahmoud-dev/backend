import RefreshToken from "../models/refreshToken.model";
import SystemUser from "../models/systemUser.model";
import { Op } from "sequelize";
import { getIO } from "./socket.service";

export async function getConnectedUsers() {
  const activeSessions = await RefreshToken.findAll({
    where: {
      EXPIRES_AT: {
        [Op.gt]: new Date(),
      },
    },
    include: [
      {
        model: SystemUser,
        as: "user",
        attributes: ["USER_ID", "USERNAME", "ROLE", "AVATAR", "FULL_NAME"],
      },
    ],
    order: [["CREATED_AT", "DESC"]],
  });

  return activeSessions;
}

export async function revokeSession(tokenId: number) {
  const session = await RefreshToken.findOne({
    where: {
      TOKEN_ID: tokenId,
    },
  });

  if (!session) {
    throw new Error("Session not found");
  }

  const userId = session.getDataValue("USER_ID");

  const result = await RefreshToken.destroy({
    where: {
      TOKEN_ID: tokenId,
    },
  });

  if (result === 0) {
    throw new Error("Session not found");
  }

  const io = getIO();
  io.to(`user_${userId}`).emit("force_logout");

  return { message: "Session revoked successfully" };
}

export const sessionService = {
  getConnectedUsers,
  revokeSession,
};
