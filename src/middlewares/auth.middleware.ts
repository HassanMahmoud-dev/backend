import { NextFunction, Request, Response } from "express";
import jwt, { VerifyErrors } from "jsonwebtoken";
import { env } from "../config/env";

export interface TokenPayload {
  userId: number;
  username: string;
  role: string;
}

export interface AuthRequest extends Request {
  user?: TokenPayload;
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "Authentication token required" });
    return;
  }

  jwt.verify(token, env.jwtSecret, (err: VerifyErrors | null, decoded: unknown) => {
    if (err) {
      res.status(401).json({ message: "Invalid or expired token" });
      return;
    }

    req.user = decoded as TokenPayload;
    next();
  });
};

export const authorizeRole = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({ message: "Access denied" });
      return;
    }
    next();
  };
};
