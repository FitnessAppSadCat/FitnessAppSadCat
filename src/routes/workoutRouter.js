import express from "express";
import {
    getAllWorkouts,
    getWorkoutById
} from "../controllers/workoutController.js"

const router = express.Router();

router.get("/", getAllWorkouts );
router.get("/:id", getWorkoutById);


export default router;