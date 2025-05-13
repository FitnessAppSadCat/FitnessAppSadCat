import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js'; 
import {
    createCustomizedWorkout,
    getCustomWorkouts,
    saveCustomWorkout,
    deleteCustomWorkout
}
    from '../controllers/customWorkoutController.js';
import { handleValidationErrors , validateWorkoutParams} from '../middleware/workoutValidator.js';

const router = express.Router();

// Route to create customized workout
router.post('/create', 
    authMiddleware, 
    ...validateWorkoutParams,
    handleValidationErrors,
    createCustomizedWorkout);


// Route to save customized workout    

router.post("/save/:id", authMiddleware, saveCustomWorkout);     

// Get customized workout

router.get("/all", authMiddleware, getCustomWorkouts); 

// Route to delete customized workout

router.delete("/:id", authMiddleware, deleteCustomWorkout);    

export default router;