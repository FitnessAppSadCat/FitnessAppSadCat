import mongoose from "mongoose";

const ExerciseSchema = new mongoose.Schema({
    bodyPart:{ type: String },
    equipment: { type: String }, 
    gifUrl: { type: String },
    id: { type: String },
    name: { type: String},
    target: { type: String },
    secondaryMuscles:  [{ type: String }],
    instructions:[{ type: String }],
  });

    export default mongoose.model("Exercise", ExerciseSchema);