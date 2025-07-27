import { Request, Response } from "express";
import { checkinsService } from "./checkins.service";

const getAll = async (req: Request, res: Response) => {
  try {
    const checkins = await checkinsService.findAll();

    return res.json(checkins);
  } catch (error) {
    console.log("Error fetching checkins", error);
  }
};

const getById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const checkin = await checkinsService.findById(id);
    if (!checkin)
      return res.status(404).json({ message: "Check-in not found" });
    return res.json(checkin);
  } catch (error) {
    console.log("Error fetching checkin", error);
  }
};

const getByUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const checkins = await checkinsService.findByUser(userId);
    return res.json(checkins);
  } catch (error) {
    console.error("Error getting user check-ins", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const create = async (req: Request, res: Response) => {
  try {
    const checkinData = req.body;
    const newCheckin = await checkinsService.create(checkinData);
    return res.status(201).json(newCheckin);
  } catch (err) {
    console.error(err);
    return res
      .status(400)
      .json({ message: "Invalid check-in data", error: err });
  }
};

const remove = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const success = await checkinsService.delete(id);
    if (!success) {
      return res
        .status(404)
        .json({ message: "Check-in not found or already deleted" });
    }
    return res.status(204).send();
  } catch (error) {
    console.error("Error deleting check-in", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export { getAll, getById, remove, create, getByUser };
