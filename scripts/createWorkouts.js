import mongoose from "mongoose";
import dotenv from "dotenv";
import Exercise from "../src/models/ExerciseModel.js";
import Workout from "../src/models/WorkoutModel.js";

// Load environment variables
dotenv.config();

const ADMIN_USER = process.env.ADMIN_USER;
const mongoUri = process.env.MONGO_URI;
const EXERCISE_LIMIT = parseInt(process.env.EXERCISE_LIMIT, 10);

// Validate environment variables
if (!mongoUri) {
  throw new Error("MONGO_URI is not defined in environment variables");
}
if (!ADMIN_USER) {
  throw new Error("ADMIN_USER is not defined in environment variables");
}

// MongoDB connection handlers
mongoose.connection.on("connected", () => {
  console.log("Mongoose connected to DB");
});
mongoose.connection.on("error", (err) => {
  console.error("Mongoose connection error:", err);
});
mongoose.connection.on("disconnected", () => {
  console.log("Mongoose disconnected");
});

const predefinedWorkouts = [
  {
    name: "Core Strength for Beginners",
    description: "Beginner core workout focusing on abs and waist area.",
    target: "abs",
    gender: "Female",
    age: { from: 18, to: 30 },
    weight: { from: 110, to: 154 }, // 50-70 кг
    level: "Beginner",
  },
  {
    name: "Core Strength for Beginners",
    description: "Beginner core workout focusing on abs and waist area.",
    target: "abs",
    gender: "Male",
    age: { from: 18, to: 30 },
    weight: { from: 110, to: 164 }, //
    level: "Beginner",
  },
  {
    name: "Full Body Bodyweight Blast",
    description:
      "Bodyweight workout engaging full body with minimal equipment.",
    target: "glutes",
    gender: "Male",
    age: { from: 20, to: 35 },
    weight: { from: 110, to: 164  }, // 65-85 кг
    level: "Beginner",
  },
  {
    name: "Full Body Bodyweight Blast",
    description:
      "Bodyweight workout engaging full body with minimal equipment.",
    target: "glutes",
    gender: "Male",
    age: { from: 20, to: 35 },
    weight: { from: 143, to: 187 }, // 65-85 кг
    level: "Intermediate",
  },
  {
    name: "Back",
    description: "Focused workout on back.",
    target: "lats",
    gender: "Male",
    age: { from: 25, to: 40 },
    weight: { from: 154, to: 198 }, // 70-90 кг
    level: "Advanced",
  },
  {
    name: "Upper legs",
    description: "Upper legs with minimal equipment.",
    target: "hamstrings",
    gender: "Male",
    age: { from: 35, to: 45 },
    weight: { from: 143, to: 187 }, // 65-85 кг
    level: "Beginner",
  },
  {
    name: "Upper legs",
    description: "Upper legs with minimal equipment.",
    target: "hamstrings",
    gender: "Female",
    age: { from: 35, to: 45 },
    weight: { from: 143, to: 187 }, // 65-85 кг
    level: "Beginner",
  },
  {
    name: "Arm Sculptor Starter",
    description:
      "Beginner-friendly arm workout to build definition and strength.",
    target: "biceps",
    gender: "Female",
    age: { from: 18, to: 35 },
    weight: { from: 110, to: 154 },
    level: "Beginner",
  },
  {
    name: "For Arm",
    description: "Arm workout.",
    target: "biceps",
    gender: "Male",
    age: { from: 20, to: 35 },
    weight: { from: 110, to: 154 },
    level: "Beginner",
  },
  {
    name: "Chest & Shoulders Power",
    description:
      "Intermediate level upper body workout with compound movements.",
    target: "pectorals",
    gender: "Male",
    age: { from: 20, to: 40 },
    weight: { from: 143, to: 187 },
    level: "Intermediate",
  },
];

const validateWorkoutConfig = (config) => {
  if (config.age.from >= config.age.to) {
    throw new Error(`Invalid age range for workout: ${config.name}`);
  }
  if (config.weight.from >= config.weight.to) {
    throw new Error(`Invalid weight range for workout: ${config.name}`);
  }
};

const createTemplateWorkouts = async () => {
  try {
    // Delete existing template workouts
    const deleteResult = await Workout.deleteMany({ isTemplate: true });
    console.log(`Deleted ${deleteResult.deletedCount} existing templates`);

    let createdCount = 0;

    for (const config of predefinedWorkouts) {
      validateWorkoutConfig(config);

      // Find exercises in MongoDB based on target muscle group
      const exercises = await Exercise.find({ target: config.target }).limit(EXERCISE_LIMIT);

      if (exercises.length < EXERCISE_LIMIT) {
        console.warn(`Not enough exercises found for target: ${config.target}. Found ${exercises.length} exercises.`);
        continue;  
    }
    

      // Map exercises to workout structure with reasonable sets/reps

      let sets;
      let reps;

      switch (config.level) {
        case "Beginner":
          sets = 3;
          reps = 10;
          break;
        case "Intermediate":
          sets = 4;
          reps = 12;
          break;
        case "Advanced":
          sets = 5;
          reps = 14;
          break;
        default:
          sets = 3;
          reps = 10;
      }
      const workoutExercises = exercises.map((ex) => ({
        exerciseId: ex._id,
        sets,
        reps,
      }));

      await Workout.create({
        ...config,
        exercises: workoutExercises,
        isTemplate: true,
        createdBy: ADMIN_USER,
      });

      createdCount++;
      console.log(`Created workout template: ${config.name}`);
    }

    console.log(`Successfully created ${createdCount} workout templates`);
    return createdCount;
  } catch (error) {
    console.error("Error creating templates:", error);
    throw error;
  }
};

const seedWorkouts = async () => {
  try {
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB");

    const createdCount = await createTemplateWorkouts();
    console.log(`Seeding completed. Created ${createdCount} workout templates`);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  } finally {
    setTimeout(async () => {
      await mongoose.disconnect();
      console.log("MongoDB connection closed");
    }, 1000);
  }
};

seedWorkouts();
