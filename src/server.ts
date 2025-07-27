import app from "./app";
import { initDB } from "./config/db";

(async () => {
  try {
    await initDB();
    app.listen(3000, () => {
      console.log("Server is running on http://localhost:3000");
    });
  } catch (error) {
    console.error("An error occurred while starting the server:", error);
  }
})();
