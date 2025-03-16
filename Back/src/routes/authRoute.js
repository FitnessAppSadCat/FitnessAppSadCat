import express from "express";
import {
  register,
  login,
  logout,
  checkToken,
  forgotPassword,
  resetPassword,
  changePassword,
} from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Публичные маршруты аутентификации (до того как юзер зашел)
router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// Требуют авторизации (после того как юзер зашел) - я это больше для себя пишу, ты итак видишь
router.post("/change-password", authMiddleware, changePassword);
router.get("/logout", authMiddleware, logout);
router.get("/check-token", authMiddleware, checkToken);

export default router;
