import { Router } from "express";
import { profile } from "./users.controller";
import { authenticate } from "../../middleware/auth.middleware";

const router = Router();

router.get("/me", authenticate, profile);

export default router;
