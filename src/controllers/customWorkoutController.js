import { StatusCodes } from "http-status-codes";
import Workout from "../models/WorkoutModel.js";



// create custom workout
const createCustomizedWorkout = async (req, res) => {
  try {
    const { level, gender, age, weight } = req.body;
    const userId = req.user.id;

    //  check if user have custom workout
    const existingCustomWorkout = await Workout.findOne({
      createdBy: userId,
      isTemplate: false,
      workoutType: "custom",
    });

    if (existingCustomWorkout) {
      return res.status(409).json({
        success: false,
        message: "You already have a customized workout. Only one is allowed.",
      });
    }

    // exact match
    const workoutQuery = {
      isTemplate: true,
      gender,
      level,
      "age.from": { $lte: age },
      "age.to": { $gte: age },
      "weight.from": { $lte: weight },
      "weight.to": { $gte: weight },
    };

    let workoutToCustomize = await Workout.findOne(workoutQuery)
      .populate("exercises.exerciseId", "name target bodyPart equipment gifUrl instructions")
      .lean();

    //  Fallback, if no exact match
    if (!workoutToCustomize) {
      const fallbackQuery = {
        isTemplate: true,
        gender,
        level,
        $or: [
          {
            "age.from": { $lte: age + 5 },
            "age.to": { $gte: age - 5 },
          },
          {
            "weight.from": { $lte: weight + 10 },
            "weight.to": { $gte: weight - 10 },
          },
        ],
      };

      const fallbackWorkouts = await Workout.find(fallbackQuery)
        .populate("exercises.exerciseId", "name target bodyPart equipment gifUrl instructions")
        .lean();

      if (!fallbackWorkouts.length) {
        return res.status(404).json({
          success: false,
          message: "No suitable workout found for your profile",
        });
      }

      workoutToCustomize = fallbackWorkouts[0];
    }

    //  creating custom workout
    const { _id, createdAt, updatedAt, createdBy, __v, ...rest } = workoutToCustomize;
    const customizedWorkout = new Workout({
      ...rest,
      isTemplate: false,
      workoutType: "custom",
      originalWorkoutId: _id,
      createdBy: userId,
    });

    const savedWorkout = await customizedWorkout.save();

    const populatedWorkout = await Workout.findById(savedWorkout._id)
      .populate("exercises.exerciseId", "name target bodyPart equipment gifUrl instructions")
      .lean();

    return res.status(201).json({
      success: true,
      message: "Customized workout created successfully",
      data: {
        _id: populatedWorkout._id,
        name: populatedWorkout.name,
        exercises: populatedWorkout.exercises,
        workoutType: populatedWorkout.workoutType,
        originalWorkoutId: populatedWorkout.originalWorkoutId,
      },
    });
  } catch (error) {
    console.error("Error in createCustomizedWorkout:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to generate customized workout",
    });
  }
};



const saveCustomWorkout = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const templateWorkout = await Workout.findOne({
      _id: id,
      isTemplate: false,
    })
      .populate("exercises.exerciseId", "name target bodyPart equipment gifUrl instructions")
      .lean();

    if (!templateWorkout) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Template workout not found or not a template",
      });
    }

    const { _id, __v, createdAt, updatedAt, ...cleanData } = templateWorkout;

    const savedWorkout = new Workout({
      ...cleanData,
      isTemplate: false,
      workoutType: "custom-saved",
      createdBy: userId,
      originalWorkoutId: id,
    });

    const saved = await savedWorkout.save();

    return res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Workout saved successfully",
      data: {
        _id: saved._id,
        name: saved.name,
        exercises: saved.exercises,
        workoutType: saved.workoutType,
        originalWorkoutId: saved.originalWorkoutId,
        isTemplate: saved.isTemplate,
      },
    });
  } catch (error) {
    console.error("Controller error:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || "Failed to save workout",
    });
  }
};

// fetch all workouts

const getCustomWorkouts = async (req, res) => {
  try {
    const userId = req.user.id;
    const workouts = await Workout.find({
      createdBy: userId,
      workoutType: "custom",
    })
      .populate({
        path: "exercises.exerciseId",
        select: "name target equipment",
      })
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    return res.status(StatusCodes.OK).json({
      success: true,
      count: workouts.length,
      data: workouts,
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to get custom workouts",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// delete custom workout

const deleteCustomWorkout = async (req, res) => {
  try {
    const { id } = req.params;

    const workout = await Workout.findById(id);

    if (!workout) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Workout not found",
      });
    }

    await Workout.findByIdAndDelete(id);

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Workout deleted successfully",
    });
  } catch (error) {
    console.error("Error in deleteWorkout:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to delete workout",
    });
  }
};

export {
  createCustomizedWorkout,
  deleteCustomWorkout,
  getCustomWorkouts,
  saveCustomWorkout,
};
