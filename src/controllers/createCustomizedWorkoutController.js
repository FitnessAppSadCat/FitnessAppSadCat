import { StatusCodes } from "http-status-codes";
import Workout from "../models/WorkoutModel.js";

const createCustomizedWorkout = async (req, res) => {
  try {
    const { level, gender, age, weight } = req.body;

    const workoutQuery = {
      isTemplate: true,
      gender,
      level,
      "age.from": { $lte: age },
      "age.to": { $gte: age },
      "weight.from": { $lte: weight },
      "weight.to": { $gte: weight },
    };

    const matchedWorkouts = await Workout.find(workoutQuery)
      .limit(1) 
      .populate({
        path: "exercises.exerciseId",
        select: "name target bodyPart equipment gifUrl instructions",
      })
      .lean();

    if (!matchedWorkouts || matchedWorkouts.length === 0) {
      const fallbackQuery = {
        isTemplate: true,
        gender,
        level,
        $or: [
          {
            $and: [
              { "age.from": { $lte: age + 5 } },
              { "age.to": { $gte: age - 5 } },
            ]
          },
          {
            $and: [
              { "weight.from": { $lte: weight + 10 } },
              { "weight.to": { $gte: weight - 10 } },
            ]
          }
        ]
      };

      const fallbackWorkouts = await Workout.find(fallbackQuery)
        .populate({
          path: "exercises.exerciseId",
          select: "name target bodyPart equipment gifUrl instructions",
        })
        .limit(1)
        .lean();

      if (fallbackWorkouts.length > 0) {
        return res.status(StatusCodes.OK).json({
          success: true,
          message: "Showing closest matching workouts",
          data: formatWorkouts(fallbackWorkouts),
        });
      }

      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "No suitable workouts found for your profile",
      });
    }

    return res.status(StatusCodes.OK).json({
      success: true,
      data: formatWorkouts(matchedWorkouts),
    });
  } catch (error) {
    console.error("Error in createCustomizedWorkout:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to generate customized workout",
    });
  }
};

function formatWorkouts(workouts) {
  if (!Array.isArray(workouts)) return [];

  return workouts.map((workout) => ({
    id: workout._id,
    name: workout.name || "Unnamed Workout",
    description: workout.description || "",
    level: workout.level,
    exercises: (workout.exercises || []).map((ex) => ({
      name: ex.exerciseId.name,
      target: ex.exerciseId.target,
      bodyPart: ex.exerciseId.bodyPart,
      equipment: ex.exerciseId.equipment,
      gifUrl: ex.exerciseId.gifUrl,
      sets: ex.sets,
      reps: ex.reps,
      instructions: ex.exerciseId.instructions,
    })),
  }));
}

export default createCustomizedWorkout;
