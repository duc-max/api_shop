import express from "express";
import {
  // uploadAvatar,
  getUserByUsername,
  updateUser,
} from "../controller/user";
import { uploadImg } from "../middlewares/upload";
import { authenticateToken } from "../middlewares/auth";

const router = express.Router();

// router.post("/upload-avatar", uploadImg.single("images"), uploadAvatar);
router.get("/current-user", authenticateToken, getUserByUsername);
router.put(
  "/update",
  authenticateToken,
  uploadImg.single("images"),
  updateUser
);

export default router;
