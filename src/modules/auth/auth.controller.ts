import { Request, Response } from "express";
import jwt from "../../utils/jwt";
import { User } from "../users/users.schema";
import { usersService } from "../users/users.service";

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

export const create = async (req: Request, res: Response) => {
  if (!req.body || typeof req.body !== "object") {
    return res.status(400).json({ error: "Invalid request body" });
  }

  const { username, deviceId, pushToken } = req.body;

  if (!username || !deviceId) {
    return res.status(400).json({ error: "Missing username or deviceId" });
  }

  if (!pushToken) {
    return res.status(400).json({ error: "Include push token" });
  }
  try {
    // let existing: User | null = null;
    // if (deviceId) {
    //   existing = await usersService.findByDeviceId(deviceId);
    // } else if (username) {
    //   existing = await usersService.findByUsername(username);
    // }

    const existing = await usersService.findByUsername(username);

    if (existing) {
      return res.status(409).json({ error: "User already exists" });
    }

    const newUser = {
      username,
      deviceId,
      pushToken,
    };

    const createdUser: User = await usersService.create(newUser);

    const token = jwt.generate({
      id: createdUser.id,
      deviceId: createdUser.deviceId,
    });
    res.setHeader("Authorization", `Bearer ${token}`);
    res.status(201).json({
      success: true,
      data: {
        user: createdUser,
        token: token,
      },
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const login = async (req: Request, res: Response) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ error: "Username is required" });
  }

  try {
    const user = await usersService.findByUsername(username);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const token = jwt.generate({
      id: user.id,
      deviceId: user.deviceId,
    });

    return res.status(200).json({
      success: true,
      data: {
        user,
        token,
      },
    });
  } catch (error) {
    console.error("Access error:", error);
    return res.status(500).json({ error: "Unable to access user" });
  }
};
