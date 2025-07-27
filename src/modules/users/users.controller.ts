import { Request, Response } from "express";
import { NewUser, User } from "./users.schema";
import { userService } from "./users.service";

export const create = async (req: Request, res: Response) => {
  const newUser: NewUser = req.body;

  try {
    const existing = await userService.findById(newUser.id);
    if (existing) {
      return res.status(400).json({ error: "User already exists" });
    }

    const createdUser: User = await userService.create(newUser);
    res.status(201).json(createdUser);
  } catch (error) {
    console.log("Error creating user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
