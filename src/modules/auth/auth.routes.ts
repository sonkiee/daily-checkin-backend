import { Router } from "express";
import { create, refreshToken } from "./auth.controller";

const router = Router();

router.post("/refresh", refreshToken);
router.post("/signup", create);

export default router;

// POST /auth/login → issues access + refresh
// POST /auth/refresh → verifies refresh, sends new access
// POST /auth/logout → clears refresh token
