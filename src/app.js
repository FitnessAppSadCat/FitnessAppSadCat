import express from "express";
const app = express();
import dotenv from "dotenv";
dotenv.config();

import cors from "cors";
import logger from "morgan";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import xss from "xss-clean";
import authRoutes from "./routes/authRouter.js";
import exercisesRouter from "./routes/exerciseRouter.js";
import workoutRouter from "./routes/workoutRouter.js";
import userWorkoutRouter from "./routes/userWorkout.js";
import customWorkoutRoute from "./routes/customWorkoutRoute.js";
import userUpdateProfileRouter from "./routes/userUpdateProfileRouter.js";
import favoriteExercisesRouter from "./routes/favoriteExercisesRouter.js";
import userInfoRouter from "./routes/userInfoRouter.js";
// middleware
const allowedOrigins = [
  "http://localhost:5173",
  "https://fitnessappsadcat.netlify.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS: " + origin));
      }
    },
    credentials: true,
  })
);

app.use(helmet());
app.use(xss());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(logger("dev"));
app.use(express.static("public"));

app.use((req, res, next) => {
  console.log(`\n[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/workouts", workoutRouter);
app.use("/api/v1/exercises", exercisesRouter);
app.use("/api/v1/saved-workouts", userWorkoutRouter);
app.use("/api/v1/customized-workout", customWorkoutRoute);
app.use("/api/v1/profile", userUpdateProfileRouter);
app.use("/api/v1/favorites", favoriteExercisesRouter);
app.use("/api/v1/user", userInfoRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Page not Found" });
});

app.use((err, req, res, next) => {
  console.error(err.stack || err);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
});

export default app;
