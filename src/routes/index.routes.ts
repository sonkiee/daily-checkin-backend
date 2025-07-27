import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to the Daily Check-in API",
    version: "0.0.0",
    documentation: "",
  });
});

export default router;
