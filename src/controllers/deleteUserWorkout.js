import Workout from "../models/WorkoutModel.js";
import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";

const deleteUserWorkout = async (req, res) => {
  try {

    const userId = req.user.id;
    const { workoutId } = req.params;

    // Validate workoutId
    if (!mongoose.Types.ObjectId.isValid(workoutId)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Invalid workout ID format"
      });
    }

    // Searching workout
    const workout = await Workout.findOne({
      _id: workoutId,
      createdBy: userId,
      isTemplate: false
    });

    if (!workout) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Workout not found or you don't have permission to delete it"
      });
    }

    // Delete
    await Workout.deleteOne({ _id: workoutId });


    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Workout deleted successfully",
      deletedWorkoutId: workoutId
    });

  } catch (error) {
    console.error("Error deleting workout:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to delete workout",
      error: process.env.NODE_ENV === "development" ? error.message : undefined
    });
  }
};

export default deleteUserWorkout;