import mongoose from "mongoose";

const UserWorkoutPlanSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  workoutPlan: { type: mongoose.Schema.Types.ObjectId, ref: "WorkoutPlan" }, // Готовый план
  customWorkoutPlan: { type: mongoose.Schema.Types.ObjectId, ref: "CustomWorkoutPlan" }, // Кастомный план
  isFavorite: { type: Boolean, default: false }, // Добавлен ли план в избранное
  progress: [
    {
      date: { type: Date, default: Date.now },
      completedExercises: [
        {
          exercise: { type: mongoose.Schema.Types.ObjectId, ref: "Exercise" },
          setsCompleted: { type: Number, default: 0 },
          repsCompleted: { type: Number, default: 0 },
          weightUsed: { type: Number, default: 0 }, // Вес, использованный в упражнении
          duration: { type: Number, default: 0 }, // Продолжительность выполнения (в минутах)
        },
      ],
    },
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Валидация: только один из планов может быть заполнен
UserWorkoutPlanSchema.pre("validate", function (next) {
  if (this.workoutPlan && this.customWorkoutPlan) {
    next(new Error("Only one of workoutPlan or customWorkoutPlan can be set"));
  } else if (!this.workoutPlan && !this.customWorkoutPlan) {
    next(new Error("Either workoutPlan or customWorkoutPlan must be set"));
  } else {
    next();
  }
});

const UserWorkoutPlan = mongoose.model("UserWorkoutPlan", UserWorkoutPlanSchema);
export default UserWorkoutPlan;