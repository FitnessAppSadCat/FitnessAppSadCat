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
import exercisesRouter from "./routes/exerciseRouter.js"
import workoutRouter from "./routes/workoutRouter.js"
import userWorkoutRouter from "./routes/userWorkout.js";  
import customWorkoutRoute from "./routes/customWorkoutRoute.js"



// middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL,
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
app.use("/api/v1/customized-workout", customWorkoutRoute)


export default app;
