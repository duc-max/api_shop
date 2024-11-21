import express from "express";
import { authenticateToken } from "../middlewares/auth";

import { signup, login, userProfile, logout } from "../controller/auth";
const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", authenticateToken, logout);
router.get("/profile", authenticateToken, userProfile);

export default router;
