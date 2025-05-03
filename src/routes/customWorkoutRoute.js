import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js'; 
import createCustomizedWorkout  from '../controllers/createCustomizedWorkoutController.js';
import { handleValidationErrors , validateWorkoutParams} from '../middleware/workoutValidator.js';

const router = express.Router();

// Route to get customized workout
router.post('/', 
    authMiddleware, 
    ...validateWorkoutParams,
    handleValidationErrors,
    createCustomizedWorkout);

export default router;