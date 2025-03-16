import express from "express";
import {
  findByEmailOrUsername,
  findByEmail,
  getUserById,
  getAllUsers,
  getUserByIdWithPassword,
  createUser,
  updateUser,
  deleteUser,
} from "../services/userServices.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// для авторизации

router.use(authMiddleware);

export default router;

// вопрос - как правильно делать юзера (в смысле отдельный делать для сервисов или сюда)
