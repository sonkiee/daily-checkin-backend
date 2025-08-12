import { Router } from "express";
import user from "../modules/users/user.routes";
import auth from "../modules/auth/auth.routes";
import checkins from "../modules/checkins/checkings.routes";

const router = Router();

// Option 1: Root route only
router.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to the Daily Check-in API",
    version: "0.0.0",
    documentation: "",
  });
});

router.use("/auth", auth);
router.use("/user", user);
router.use("/checkins", checkins);

// Option 2: Handle 404s differently
router.use((req, res) => {
  res.status(404).json({
    message: "Endpoint not found",
    // availableEndpoints: ["/auth", "/user", "/checkins"],
  });
});

export default router;
