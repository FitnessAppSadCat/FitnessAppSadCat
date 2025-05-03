import Exercise from "../models/ExerciseModel.js";
import { StatusCodes } from "http-status-codes";

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

    const skip = (limitNumber > 0) ? (pageNumber - 1) * limitNumber : 0;

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
