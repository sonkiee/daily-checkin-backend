import { Response } from "express";
import { NODE_ENV } from "../config/env";

export const set = (res: Response, token: string) => {
  const isProduction = NODE_ENV === "production";
  res.cookie("token", token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax", //
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
  });
};
