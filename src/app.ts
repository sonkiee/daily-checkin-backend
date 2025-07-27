import express from "express";
import cookieParser from "cookie-parser";
import compression from "compression";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(compression());

export default app;
