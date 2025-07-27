import { Router } from "express";
import { create } from "./users.controller";

const router = Router();

router.post("/", create);

export default router;
