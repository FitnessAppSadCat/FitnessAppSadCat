import express from "express";
import {
    getAllWorkouts,
} from "../controllers/workoutController.js"

const router = express.Router();

router.get("/", getAllWorkouts );

export default router;