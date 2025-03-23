// filter customizedWorkout
import mongoose from "mongoose";

const customWorkoutPlanSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    exercises: [
      {
        exercise: { type: mongoose.Schema.Types.ObjectId, ref: "Exercise" },
        sets: { type: Number, default: 3 },
        reps: { type: Number, default: 10 },
      },
    ],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Пользователь, создавший план
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  });


  const CustomWorkout = mongoose.model("CustomWorkout", customWorkoutPlanSchema);
  export default CustomWorkout;