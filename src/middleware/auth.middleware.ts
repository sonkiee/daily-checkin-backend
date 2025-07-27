import { NextFunction, Request, Response } from "express";
import jwt from "../utils/jwt";
import { User } from "../modules/users/users.schema";
import { userService } from "../modules/users/users.service";

interface AuthRequest extends Request {
  user?: User;
}

const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const auth = req.headers.authorization ?? "";

    if (!auth || !auth.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Missing or invalid Authorization header" });
    }

    const token = auth.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Missing auth token" });
    }

    const decoded = jwt.verify(token);
    const user = await userService.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Authentication error", error);
    return res.status(401).json({ message: "Invalid token or unauthorized" });
  }
};

export { authenticate, AuthRequest };
