import { Router } from "express";
import {
  create,
  getAll,
  getById,
  getByUser,
  remove,
} from "./checkins.controller";

const router = Router();

router.get("/", getAll);
router.get("/:id", getById);

// User-specific (auth required)
router.get("/user/:userId", getByUser);
router.post("/", create);
router.delete("/:id", remove);

export default router;
