import mongoose from "mongoose";


const WorkoutSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    exercises: [{
        exerciseId: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Exercise', 
            required: true
        }, 
        sets: { 
            type: Number, 
            default: 3 
        },
        reps: { 
            type: Number, 
            default: 10 
        },
      },
    ],
    gender: {
        type: String, 
        enum: ["Male", "Female"], 
        required: true
    },
    age: {
        from: { 
          type: Number, 
          required: true,
          min: 10,
          max: 100 
        },
        to: { 
          type: Number, 
          required: true, 
          min: 10,
          max: 100 
        },
    },

    weight: {
        from: { 
          type: Number, 
          required: true,
          min: 30,
          max: 200,
        },
        to: { 
          type: Number, 
          required: true,
          min: 30,
          max: 200,
        },        

    },
    level: {
        type: String, 
        enum: ["Beginner","Intermediate", "Advanced"], 
        required: true 
    },

    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    isTemplate: {
      type: Boolean,
      default: false
    },
    originalWorkoutId: { type: mongoose.Schema.Types.ObjectId, ref: "Workout", default: null }, 
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  });

   const Workout = mongoose.model("Workout", WorkoutSchema);
    export default Workout;