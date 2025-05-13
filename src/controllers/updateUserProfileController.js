import { updateUser } from "../../services/userService.js";
import User from "../models/UserModel.js";
import { StatusCodes } from "http-status-codes";

async function updateUserProfile(req, res) {
  const userId = req.user.id;
  const { gender, age, weight, fitnessLevel } = req.body;

  if (
    gender === undefined &&
    age === undefined &&
    weight === undefined &&
    fitnessLevel === undefined
  ) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: "At least one field must be provided",
    });
  }

  const updateData = {};
  if (gender !== undefined) updateData.gender = gender;
  if (age !== undefined) updateData.age = age;
  if (weight !== undefined) updateData.weight = weight;
  if (fitnessLevel !== undefined) updateData.fitnessLevel = fitnessLevel;

  try {
    const updatedUser = await updateUser(userId, updateData);

    if (!updatedUser) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Profile updated",
      shouldRegenerateCustomWorkout: true,
    });
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Something went wrong",
    });
  }
}

export default updateUserProfile;
