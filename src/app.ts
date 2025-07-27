import express from "express";
import cookieParser from "cookie-parser";
import compression from "compression";
import router from "./routes/index.routes";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(compression());

app.use("/api/v1", router);

export default app;
