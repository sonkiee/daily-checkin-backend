import { Router } from "express";
import user from "../modules/users/user.routes";
import auth from "../modules/auth/auth.routes";

const router = Router();

router.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to the Daily Check-in API",
    version: "0.0.0",
    documentation: "",
  });
});

router.use("/auth", auth);
router.use("/user", user);

export default router;
