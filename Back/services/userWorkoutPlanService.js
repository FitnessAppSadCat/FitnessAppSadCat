import UserWorkoutPlan from "../models/UserWorkoutPlan.js";

export const createUserWorkoutPlan = async (userId, workoutPlanId, isFavorite) => {
  try {
    const userWorkoutPlan = new UserWorkoutPlan({
      user: userId,
      workoutPlan: workoutPlanId,
      isFavorite,
    });

    await userWorkoutPlan.save();
    return userWorkoutPlan;
  } catch (error) {
    console.error("Error creating user workout plan:", error);
    throw new Error("Failed to create user workout plan");
  }
};