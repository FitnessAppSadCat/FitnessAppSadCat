import express from "express";
import {
  getAllFavoriteExercises,
  addFavoriteExercise,
  removeFavoriteExercise,
} from "../controllers/exerciseController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import userValidater from "../middleware/userValidator.js";

const router = express.Router();

router.use(authMiddleware, userValidater);

router.get("/", getAllFavoriteExercises);

router.post("/:exerciseId", addFavoriteExercise);

router.delete("/:exerciseId", removeFavoriteExercise);

export default router;
