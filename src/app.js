import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import productRouter from "./routers/product";
import authRouter from "./routers/auth";
import userRouter from "./routers/user";
import cartRouter from "./routers/cart";

import { connectionDB } from "./config/db";
import error from "./middlewares/error";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Connect to the database
connectionDB("mongodb://localhost:27017/shop");

// Define routes
app.use("/api", productRouter);
app.use("/api", authRouter);
app.use("/api/me", userRouter);
app.use("/api/cart", cartRouter);

// Export the app for Vite
export const viteNodeApp = app;
