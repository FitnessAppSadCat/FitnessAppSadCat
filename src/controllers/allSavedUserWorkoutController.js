import Workout from "../models/WorkoutModel.js";
import { StatusCodes } from "http-status-codes";

const getUserSavedWorkouts = async (req, res) => {
  try {

    const userId = req.user.id;
    console.log("Fetching workouts for user:", userId);

    // Find and populate
    const workouts = await Workout.find(
      { createdBy: userId, isTemplate: false },
    )
    .populate({
      path: "exercises.exerciseId",
    }) 
    .lean();

    const formattedWorkouts = workouts.map(workout => {
      const workoutObj = workout.toObject ? workout.toObject() : workout;
      
      return {
        ...workoutObj,
        exercises: workoutObj.exercises.map(ex => {
          const { name, target, bodyPart, equipment, gifUrl, secondaryMuscles, instructions, _id } = ex.exerciseId || {};
          
          return {
            sets: ex.sets,
            reps: ex.reps,
            _id: ex._id,
            
            exerciseName: name,
            exerciseTarget: target,
            bodyPart,
            equipment,
            gifUrl,
            secondaryMuscles: secondaryMuscles || [], 
            instructions: instructions || [],
            exerciseId: _id
          };
        })
      };
    });
    
    res.status(StatusCodes.OK).json({
      success: true,
      count: workouts.length,
      data: formattedWorkouts
    });



  } catch (error) {
    console.error("Error fetching user workouts:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Failed to fetch workouts",
      error: process.env.NODE_ENV === "development" ? error.message : undefined
    });
  }
};

export default getUserSavedWorkouts;