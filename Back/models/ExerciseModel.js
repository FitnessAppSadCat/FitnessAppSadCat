import mongoose from "mongoose";

const exerciseSchema = new mongoose.Schema({
    bodyPart:{ type: String },
    equipment: { type: String }, 
    gifUrl: { type: String },
    id: { type: String },
    name: { type: String},
    target: { type: String },
    secondaryMuscles: [],
    instructions:{ type: String },
    createdAt: { type: Date, default: Date.now },
  });

    const Exercise = mongoose.model("Exercise", exerciseSchema);
    export default Exercise;