// Str.Goal
import mongoose from "mongoose";

const activity = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide company name"],
      maxlength: 50,
    },

    duration: {
      type: String,
      required: [true, "Please provide the activity duration"],
      maxlength: 50,
    },

    activity: {
      type: String,
      maxlength: 50,
    },

    createdByuser: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide user"],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Activity", activity);
