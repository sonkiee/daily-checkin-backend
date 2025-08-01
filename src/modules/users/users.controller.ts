import { Response } from "express";
import { AuthRequest } from "../../middleware/auth.middleware";

export const profile = async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  const user = req.user;

  return res.status(200).json({
    data: {
      user,
    },
  });
};
