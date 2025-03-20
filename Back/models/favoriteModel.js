// из workouts and programs
import mongoose from "mongoose";

const favExsSchema = new mongoose.Schema(
  {
    favExs: {
      type: [String],
      default: [],
    },

    createdByuser: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide user"],
    },
  },
  { timestamps: true }
);
export default mongoose.model("favExercise", favExsSchema);

const favprogramm = {};
