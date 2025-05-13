import Exercise from "../models/ExerciseModel.js";
import { StatusCodes } from "http-status-codes";
import * as userService from "../../services/userService.js";
import mongoose from "mongoose";

// Get all exercises
export const getAllExercises = async (req, res) => {
  try {
    const {
      name,
      bodyPart,
      equipment,
      target,
      secondaryMuscles,
      page = 1,
      limit = 10,
    } = req.query;
    const filters = {};

    if (name) {
      filters.name = { $regex: new RegExp(name, "i") };
    }

    if (bodyPart) {
      filters.bodyPart = { $regex: new RegExp(bodyPart, "i") };
    }

    if (equipment) {
      filters.equipment = { $regex: new RegExp(equipment, "i") };
    }

    if (target) {
      filters.target = { $regex: new RegExp(target, "i") };
    }

    if (secondaryMuscles) {
      filters.secondaryMuscles = { $regex: new RegExp(secondaryMuscles, "i") };
    }

    // // Pagination logic
    const pageNumber = Math.max(1, parseInt(page, 10) || 1);
    const limitNumber = parseInt(limit, 10);

    const skip = limitNumber > 0 ? (pageNumber - 1) * limitNumber : 0;

    let query = Exercise.find(filters);

    if (limitNumber > 0) {
      query = query.skip(skip).limit(limitNumber);
    }

    const result = await query.lean();
    const total = await Exercise.countDocuments(filters);
    const totalPages = limitNumber > 0 ? Math.ceil(total / limitNumber) : 1;

    // respond

    res.status(StatusCodes.OK).json({
      success: true,
      count: result.length,
      currentPage: pageNumber,
      totalPages,
      data: result,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Server error",
    });
  }
};

const favoriteLimit = 30;

export const getAllFavoriteExercises = async (req, res) => {
  try {
    const user = req.currentUser;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || favoriteLimit;
    const startIndex = (page - 1) * limit;

    const favoriteExercises = user.favoriteExercises;
    const paginated = favoriteExercises.slice(startIndex, startIndex + limit);
    const totalPages = Math.ceil(favoriteExercises.length / limit);

    const response = {
      success: true,
      count: paginated.length,
      currentPage: page,
      totalPages,
      data: paginated.map((exercise) => ({
        _id: exercise._id,
        name: exercise.name,
        target: exercise.target,
        bodyPart: exercise.bodyPart,
        equipment: exercise.equipment,
        gifUrl: exercise.gifUrl,
        secondaryMuscles: exercise.secondaryMuscles || [],
        instructions: exercise.instructions || [],
      })),
    };

    res.status(StatusCodes.OK).json(response);
  } catch (error) {
    console.error("Error fetching favorite exercises:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal server error while fetching favorite exercises",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export const addFavoriteExercise = async (req, res) => {
  try {
    const { exerciseId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(exerciseId)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Invalid exercise ID format",
      });
    }

    const exercise = await Exercise.findById(exerciseId).lean();
    if (!exercise) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Exercise not found",
      });
    }

    const user = await userService.getUserById(req.user.id);

    if (user.favoriteExercises.some((id) => id.toString() === exerciseId)) {
      return res.status(StatusCodes.CONFLICT).json({
        success: false,
        message: "Exercise is already in your favorites",
      });
    }

    if (user.favoriteExercises.length >= favoriteLimit) {
      return res.status(StatusCodes.CONFLICT).json({
        success: false,
        message: `You can only save up to ${favoriteLimit} favorite exercises`,
      });
    }

    await userService.addFavoriteExercise(req.user.id, exerciseId);

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Exercise added to favorites",
    });
  } catch (error) {
    console.error("Error adding to favorites:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal server error while adding to favorites",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export const removeFavoriteExercise = async (req, res) => {
  try {
    const { exerciseId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(exerciseId)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Invalid exercise ID format",
      });
    }

    const user = req.currentUser;
    if (
      !user.favoriteExercises.some((ex) => ex._id.toString() === exerciseId)
    ) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Exercise not found in favorites",
      });
    }

    await userService.removeFavoriteExercise(user._id, exerciseId);

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Exercise removed from favorites",
    });
  } catch (error) {
    console.error("Error removing from favorites:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal server error while removing from favorites",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
