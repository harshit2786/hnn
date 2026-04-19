import type { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import type { AuthRequest } from "./auth.middleware.js";

export function optionalAuth(
  req: AuthRequest,
  _res: Response,
  next: NextFunction
) {
  const token = req.headers.authorization?.split(" ")[1];
  if (token) {
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
        userId: string;
      };
      req.userId = payload.userId;
    } catch {
      // token invalid — treat as unauthenticated
    }
  }
  next();
}
