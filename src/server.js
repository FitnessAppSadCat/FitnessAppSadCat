import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import connectDB from "../services/db.js";

const PORT = process.env.PORT || 8000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));
  } catch (error) {
    console.error("Failed to start server:", error);
  }
};

start();
