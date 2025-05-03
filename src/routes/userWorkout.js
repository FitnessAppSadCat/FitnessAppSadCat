import express from 'express';
import { saveWorkoutForUser } from '../controllers/saveWorkoutController.js';
import authMiddleware from '../middleware/authMiddleware.js'; 
import getSavedWorkouts from '../controllers/allSavedUserWorkoutController.js'
import deleteUserWorkout from "../controllers/deleteUserWorkout.js"

const router = express.Router();


router.post(
  '/:workoutId',
  authMiddleware, 
  saveWorkoutForUser 
);
router.get("/all", authMiddleware, getSavedWorkouts);
router.delete(
  '/:workoutId',
  authMiddleware,
  deleteUserWorkout
);
export default router;