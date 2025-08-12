import app from "./app";
import { initDB } from "./config/db";

const { PORT, HOST } = process.env;

if (!PORT || !HOST) {
  throw new Error(
    "Missing required environment variables: PORT and HOST must be set."
  );
}

(async () => {
  try {
    await initDB();
    app.listen(PORT, () => {
      console.log(`Server is running on http://${HOST}:${PORT}`);
    });
  } catch (error) {
    console.error("An error occurred while starting the server:", error);
  }
})();
