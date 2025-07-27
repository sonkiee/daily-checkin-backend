import { Request, Response } from "express";
import jwt from "../../utils/jwt";

const refreshToken = (req: Request, res: Response) => {
  const token = req.body.refreshToken;

  if (!token)
    return res.status(400).json({
      error: "No refresh token provided",
    });

  const { valid, expired, decoded } = jwt.verify(token);

  if (!valid) {
    return res.status(401).json({
      error: expired ? "Refresh token expired" : "Invalid refresh token",
    });
  }

  const newToken = jwt.generate({ id: decoded!.id });
  res.status(200).json(newToken);
};

export { refreshToken };
