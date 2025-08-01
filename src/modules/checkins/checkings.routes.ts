import { Router } from "express";
import {
  create,
  getAll,
  getById,
  getByUser,
  remove,
  completeAdReward,
} from "./checkins.controller";
import { authenticate } from "../../middleware/auth.middleware";

const router = Router();

router.get("/", getAll);
router.get("/:id", getById);

// User-specific (auth required)
router.get("/user/:userId", getByUser);
router.post("/", authenticate, create);
router.post("/ad-reward", authenticate, completeAdReward);
router.delete("/:id", remove);

export default router;
