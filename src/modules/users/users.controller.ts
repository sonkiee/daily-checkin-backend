import { Request, Response } from "express";
import { NewUser, User } from "./users.schema";
import { usersService } from "./users.service";
import jwt from "../../utils/jwt";

export const create = async (req: Request, res: Response) => {
  const newUser: NewUser = req.body;

  if (!newUser.deviceId) {
    return res.status(400).json({ error: "Missing id or deviceId" });
  }

  try {
    const existing = await usersService.findByDeviceId(newUser.deviceId!);

    if (existing) {
      return res.status(409).json({ error: "User already exists" });
    }

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
