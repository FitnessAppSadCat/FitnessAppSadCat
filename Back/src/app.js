import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoute.js";
import connectDB from "./mongoDBConnect/connectDB.js";

//
dotenv.config();
const app = express();

app.use(express.json());
app.use(cookieParser());

// Маршруты
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(PORT, () =>
      console.log(`Server is listening on port ${PORT}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
