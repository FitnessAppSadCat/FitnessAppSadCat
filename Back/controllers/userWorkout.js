import { createUserWorkoutPlan } from "../services/userWorkoutPlanService.js";

export const createUserWorkoutPlanController = async (req, res) => {
  try {
    const { userId, workoutPlanId, isFavorite } = req.body;

    const userWorkoutPlan = await createUserWorkoutPlan(userId, workoutPlanId, isFavorite);

    res.status(201).json({
      message: "User workout plan created successfully",
      userWorkoutPlan,
    });
  } catch (error) {
    console.error("Error creating user workout plan:", error);
    res.status(500).json({ message: "Failed to create user workout plan" });
  }
};