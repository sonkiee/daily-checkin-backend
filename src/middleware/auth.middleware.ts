import { NextFunction, Request, Response } from "express";
import jwt from "../utils/jwt";
import { User } from "../modules/users/users.schema";
import { usersService } from "../modules/users/users.service";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";

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

    if (!auth) {
      return res.status(401).json({
        success: false,
        error: "AUTH_HEADER_MISSING",
        message: "Authorization header missing",
      });
    }

    if (!auth.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        error: "AUTH_HEADER_INVALID",
        message: "Authorization must be a Bearer token",
      });
    }

    const token = auth.split(" ")[1];
    console.log("Received token:", token);

    if (!token) {
      return res.status(401).json({
        success: false,
        error: "TOKEN_MISSING",
        message: "Auth token is missing in Bearer header",
      });
    }

    const decoded = jwt.verify(token);
    console.log("Decoded token:", decoded);
    const user = await usersService.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        error: "USER_NOT_FOUND",
        message: "User associated with token not found",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      return res.status(401).json({
        success: false,
        error: "TOKEN_EXPIRED",
        message: "Token has expired. Please log in again.",
      });
    }

    if (error instanceof JsonWebTokenError) {
      return res.status(401).json({
        success: false,
        error: "INVALID_TOKEN",
        message: "Token is invalid or malformed",
      });
    }

    console.error("Unexpected auth error:", error);
    return res.status(500).json({
      success: false,
      error: "AUTH_ERROR",
      message: "Internal server error during authentication",
    });
  }
};

export { authenticate, AuthRequest };
