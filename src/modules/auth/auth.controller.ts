import { Request, Response } from "express";
import jwt from "../../utils/jwt";

export const refreshToken = (req: Request, res: Response) => {
  try {
    const token = req.body.refreshToken;

    if (!token) {
      return res.status(400).json({ error: "No refresh token provided" });
    }

    const { valid, expired, decoded } = jwt.verify(token);

    if (!valid || !decoded) {
      return res.status(401).json({
        error: expired ? "Refresh token expired" : "Invalid refresh token",
      });
    }

    const newToken = jwt.generate({ id: decoded.id });
    return res.status(200).json({ token: newToken });
  } catch (error) {
    console.error("Refresh error:", error);
    return res.status(500).json({ error: "Token refresh failed" });
  }
};
