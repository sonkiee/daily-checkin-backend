import { Router } from "express";

const router = Router();

export default router;

// POST /auth/login → issues access + refresh
// POST /auth/refresh → verifies refresh, sends new access
// POST /auth/logout → clears refresh token
