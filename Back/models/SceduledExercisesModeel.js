import mongoose from "mongoose";


const scheduledExercisesSchema = new mongoose.Schema({
    exercise: { type: mongoose.Schema.Types.ObjectId, ref: "Exercise", required: true },
    date: { type: Date, required: true }, // Дата тренировки
    isCompleted: { type: Boolean, default: false }, // Завершено ли упражнение
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  });

    const ScheduledExercises = mongoose.model("ScheduledExercises", scheduledExercisesSchema);
    export default ScheduledExercises;