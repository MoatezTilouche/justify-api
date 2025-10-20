import { Request, Response, NextFunction } from "express";
import { Storage } from "./storage.js";

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = req.header("Authorization")?.replace(/^Bearer\s+/, "");
  if (!token) return res.status(401).json({ error: "Missing Bearer token" });

  const record = Storage.getToken(token);
  if (!record) return res.status(401).json({ error: "Invalid token" });

  (req as any).token = token;
  next();
}
