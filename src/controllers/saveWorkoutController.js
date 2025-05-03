import Workout from "../models/WorkoutModel.js";
import mongoose from "mongoose";
import { StatusCodes } from 'http-status-codes';

export const saveWorkoutForUser = async (req, res) => {
  try {
    console.log('\n=== CONTROLLER START ===');
    console.log('Request user:', req.user);
    

    const userId = req.user.id;
    console.log('Processing request for user:', userId);

    // Workout limit check

    const currentWorkoutsCount = await Workout.countDocuments({ 
        createdBy: userId, 
        isTemplate: false 
      });
  
      if (currentWorkoutsCount >= 50) {
        return res.status(StatusCodes.FORBIDDEN).json({
          success: false,
          message: "Workout limit reached (max 50 saved workouts)",
          limit: 50,
          currentCount: currentWorkoutsCount,
          actionSuggestion: "Delete old workouts to save new ones"
        });
      }

    // Validating workoutId
    const { workoutId } = req.params;
    console.log('Received workoutId:', workoutId);

    if (!mongoose.Types.ObjectId.isValid(workoutId)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Invalid workout ID format",
        debug: process.env.NODE_ENV === 'development' ? {
          receivedId: workoutId,
          expectedFormat: "24-character hexadecimal string"
        } : undefined
      });
    }

    // Find original workout
    const templateWorkout = await Workout.findOne({
      _id: workoutId,
      isTemplate: true
    }).populate("exercises.exerciseId").lean();

    if (!templateWorkout) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Template workout not found"
      });
    }

    // Check for duplicates
    const existingWorkout = await Workout.findOne({
      originalWorkoutId: workoutId,
      createdBy: userId,
      isTemplate: false
    });

    if (existingWorkout) {
      return res.status(StatusCodes.CONFLICT).json({
        success: false,
        message: "Workout already saved",
        data: {
          existingWorkoutId: existingWorkout._id
        }
      });
    }

    // Create a copy
    const userWorkout = await Workout.create({
      ...templateWorkout,
      _id: new mongoose.Types.ObjectId(),
      isTemplate: false,
      createdBy: userId,
      originalWorkoutId: templateWorkout._id,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Response
    const response = {
      success: true,
      message: "Workout saved successfully",
      data: {
        id: userWorkout._id,
        name: userWorkout.name,
        description: userWorkout.description,
        isTemplate: userWorkout.isTemplate,
        originalWorkoutId: userWorkout.originalWorkoutId,
        createdAt: userWorkout.createdAt,
        exercises: userWorkout.exercises.map(ex => ({
          exerciseId: ex.exerciseId?._id || null,
          sets: ex.sets,
          reps: ex.reps,
          exerciseName: ex.exerciseId?.name || null,
          exerciseTarget: ex.exerciseId?.target || null,
          bodyPart: ex.exerciseId?.bodyPart || null,
          equipment: ex.exerciseId?.equipment || null,
          gifUrl: ex.exerciseId?.gifUrl || null,
          secondaryMuscles: ex.exerciseId?.secondaryMuscles || [] // Include secondary muscles
        }))
      }
    };

    console.log('Workout saved successfully');
    return res.status(StatusCodes.CREATED).json(response);

  } catch (error) {
    console.error("Controller error:", {
      error: error.message,
      stack: error.stack,
      request: {
        user: req.user,
        params: req.params
      }
    });

    const statusCode = error instanceof mongoose.Error.ValidationError
      ? StatusCodes.BAD_REQUEST
      : StatusCodes.INTERNAL_SERVER_ERROR;

    return res.status(statusCode).json({
      success: false,
      message: error.message.includes('validation') 
        ? "Validation error" 
        : "Failed to save workout",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
