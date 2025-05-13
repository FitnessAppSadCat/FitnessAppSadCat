import Workout from "../models/WorkoutModel.js";
import mongoose from "mongoose";
import { StatusCodes } from "http-status-codes";

// Valid values from model schema
const VALID_GENDERS = ["Male", "Female"];
const VALID_LEVELS = ["Beginner", "Intermediate", "Advanced"];
const MAX_LIMIT = 100;
const MIN_AGE = 10;
const MAX_AGE = 100;
const MIN_WEIGHT = 30;
const MAX_WEIGHT = 200;

export const getAllWorkouts = async (req, res) => {
  try {
    const {
      isTemplate,
      userId,
      search,
      level,
      gender,
      age,
      weight,
      page = 1,
      limit = 10,
    } = req.query;

    const query = {};
    const validationErrors = [];

    // Validate isTemplate
    if (isTemplate !== undefined) {
      if (
        isTemplate === "true" ||
        isTemplate === "false" ||
        typeof isTemplate === "boolean"
      ) {
        query.isTemplate = String(isTemplate).toLowerCase() === "true";
      } else {
        validationErrors.push(
          "isTemplate must be boolean or string 'true'/'false'"
        );
      }
    }

    // Validate userId
    if (userId) {
      if (mongoose.Types.ObjectId.isValid(userId)) {
        query.createdBy = userId;
      } else {
        validationErrors.push(
          "Invalid userId format - must be MongoDB ObjectId"
        );
      }
    }

    // Validate search query (non-empty string)
    if (search) {
      if (typeof search === "string" && search.trim().length > 0) {
        query.name = { $regex: search.trim(), $options: "i" };
      } else {
        validationErrors.push("Search query must be non-empty string");
      }
    }

    // Validate level against enum values
    if (level) {
      if (VALID_LEVELS.includes(level)) {
        query.level = level;
      } else {
        validationErrors.push(
          `Invalid level. Allowed values: ${VALID_LEVELS.join(", ")}`
        );
      }
    }

    // Validate gender against enum values
    if (gender) {
      if (VALID_GENDERS.includes(gender)) {
        query.gender = gender;
      } else {
        validationErrors.push(
          `Invalid gender. Allowed values: ${VALID_GENDERS.join(", ")}`
        );
      }
    }

    // Validate age (number within allowed range)
    if (age !== undefined) {
      const ageNum = Number(age);
      if (!isNaN(ageNum) && ageNum >= MIN_AGE && ageNum <= MAX_AGE) {
        query.$and = [
          { "age.from": { $lte: ageNum } }, // Workout's minimum age <= requested age
          { "age.to": { $gte: ageNum } }, // Workout's maximum age >= requested age
        ];
      } else {
        validationErrors.push(
          `Age must be number between ${MIN_AGE} and ${MAX_AGE}`
        );
      }
    }

    // Validate weight (number within allowed range)
    if (weight !== undefined) {
      const weightNum = Number(weight);
      if (
        !isNaN(weightNum) &&
        weightNum >= MIN_WEIGHT &&
        weightNum <= MAX_WEIGHT
      ) {
        query.$and = (query.$and || []).concat([
          { "weight.from": { $lte: weightNum } }, // Workout's min weight <= requested weight
          { "weight.to": { $gte: weightNum } }, // Workout's max weight >= requested weight
        ]);
      } else {
        validationErrors.push(
          `Weight must be number between ${MIN_WEIGHT} and ${MAX_WEIGHT}`
        );
      }
    }

    // Return all validation errors at once
    if (validationErrors.length > 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Request validation failed",
        errors: validationErrors,
      });
    }

    // Validate and calculate pagination parameters
    const pageNumber = Math.max(1, parseInt(page, 10) || 1);
    const limitNumber = Math.min(
      MAX_LIMIT,
      Math.max(1, parseInt(limit, 10) || 10)
    );
    const skip = (pageNumber - 1) * limitNumber;

    // Execute database query with filtering, sorting and pagination
    const workouts = await Workout.find(query)
      .sort({ createdAt: -1 }) // Newest first
      .skip(skip)
      .limit(limitNumber)
      .populate("createdBy", "email") // Only include creator's email
      .populate({
        path: "exercises.exerciseId",
        select:
          "name target bodyPart equipment gifUrl secondaryMuscles instructions",
      })
      .lean();

    // Get total count for pagination info
    const totalItems = await Workout.countDocuments(query);
    const totalPages = Math.ceil(totalItems / limitNumber);

    // Prepare API response
    const response = {
      success: true,
      count: workouts.length,
      totalItems,
      currentPage: pageNumber,
      totalPages,
      data: workouts.map((workout) => ({
        id: workout._id,
        name: workout.name,
        description: workout.description,
        exerciseCount: workout.exercises?.length || 0,
        isTemplate: workout.isTemplate,
        level: workout.level,
        gender: workout.gender,
        age: workout.age,
        weight: workout.weight,
        createdBy: workout.createdBy?._id || null, // Only return ID
        createdAt: workout.createdAt,
        originalWorkoutId: workout.originalWorkoutId || null,

        exercises:
          workout.exercises?.map((ex) => ({
            exerciseId: ex.exerciseId?._id || null,
            sets: ex.sets,
            reps: ex.reps,
            exerciseName: ex.exerciseId?.name || null,
            exerciseTarget: ex.exerciseId?.target || null,
            // Add these new fields:
            bodyPart: ex.exerciseId?.bodyPart || null,
            equipment: ex.exerciseId?.equipment || null,
            gifUrl: ex.exerciseId?.gifUrl || null,
            secondaryMuscles: ex.exerciseId?.secondaryMuscles || [],
            instructions: ex.exerciseId?.instructions || [], // Empty array if no exercises
          })) || [],
      })),
    };

    res.status(StatusCodes.OK).json(response);
  } catch (error) {
    console.error("Database query error:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal server error while fetching workouts",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export const getWorkoutById = async (req, res) => {
  try {
    const { id } = req.params;

    // check if ID valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Invalid workout ID format",
      });
    }

    const workout = await Workout.findById(id)
      .populate("createdBy", "email")
      .populate({
        path: "exercises.exerciseId",
        select:
          "name target bodyPart equipment gifUrl secondaryMuscles instructions",
      })
      .lean();

    if (!workout) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Workout not found",
      });
    }

    const copies = await Workout.find({ originalWorkoutId: id }) //find copies
      .select("_id createdBy")
      .lean();

    const formattedWorkout = {
      id: workout._id,
      name: workout.name,
      description: workout.description,
      exerciseCount: workout.exercises?.length || 0,
      isTemplate: workout.isTemplate,
      level: workout.level,
      gender: workout.gender,
      age: workout.age,
      weight: workout.weight,
      createdBy: workout.createdBy?._id || null,
      createdAt: workout.createdAt,
      originalWorkoutId: workout.originalWorkoutId || null,
      exercises:
        workout.exercises?.map((ex) => ({
          exerciseId: ex.exerciseId?._id || null,
          sets: ex.sets,
          reps: ex.reps,
          exerciseName: ex.exerciseId?.name || null,
          exerciseTarget: ex.exerciseId?.target || null,
          bodyPart: ex.exerciseId?.bodyPart || null,
          equipment: ex.exerciseId?.equipment || null,
          gifUrl: ex.exerciseId?.gifUrl || null,
          secondaryMuscles: ex.exerciseId?.secondaryMuscles || [],
          instructions: ex.exerciseId?.instructions || [],
        })) || [],
      copies:
        copies.map((copy) => ({
          id: copy._id,
          copiedBy: copy.createdBy,
        })) || [],
    };

    res.status(StatusCodes.OK).json({
      success: true,
      data: formattedWorkout,
    });
  } catch (error) {
    console.error("Error fetching workout by ID:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal server error while fetching workout",
    });
  }
};
