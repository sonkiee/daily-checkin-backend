import { Request, Response } from "express";
import { NewUser, User } from "./users.schema";
import { userService } from "./users.service";
import jwt from "../../utils/jwt";

export const create = async (req: Request, res: Response) => {
  const newUser: NewUser = req.body;

  if (!newUser.id && !newUser.deviceId) {
    return res.status(400).json({ error: "Missing id or deviceId" });
  }

  try {
    let existing: User | null = null;

    if (newUser.id) {
      existing = await userService.findById(newUser.id);
    } else if (newUser.deviceId) {
      existing = await userService.findByDeviceId(newUser.deviceId);
    }

    if (existing) {
      return res.status(409).json({ error: "User already exists" });
    }

    const createdUser: User = await userService.create(newUser);

    const token = jwt.sign({
      id: createdUser.id,
      deviceId: createdUser.deviceId,
    });
    res.setHeader("Authorization", `Bearer ${token}`);
    res.status(201).json(createdUser);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
