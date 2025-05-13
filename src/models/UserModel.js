import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Please provide email"],
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please provide valid email",
      ],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Please provide Password"],
      minlength: 6,
      // maxlength: 35,
    },
    firstName: {
      type: String,
      required: [true, "Please provide First Name"],
      minlength: 1,
      maxlength: 35,
    },

    lastName: {
      type: String,
      required: [true, "Please provide Last Name"],
      minlength: 1,
      maxlength: 35,
    },
    customWorkout: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Workout",
      default: [],
    },
    favoriteExercises: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Exercise",
      default: [],
    },
    age: {
      type: Number,
      min: 10,
      max: 100,
    },
    weight: {
      type: Number,
      min: 30,
      max: 300,
      description: "lbs",
    },
    fitnessLevel: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
    },
    gender: {
      type: String,
      enum: ["Male", "Female"],
    },
    refreshToken: { type: String, default: "" },
    refreshTokenUpdatedAt: {
      type: Date,
      default: Date.now,
    },
    refreshTokenExpiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.createJWT = function () {
  return jwt.sign(
    {
      userId: this._id,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_LIFETIME }
  );
};

userSchema.methods.createRefreshToken = function () {
  return jwt.sign({ userId: this._id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "24h", // i check some information and it can be from 24h by 180 days some where... may be change it back to 7days?
  });
};

userSchema.methods.comparePassword = async function (enteredPassword) {
  const isMatch = await bcrypt.compare(enteredPassword, this.password);
  return isMatch;
};

const User = mongoose.model("User", userSchema);
export default User;
