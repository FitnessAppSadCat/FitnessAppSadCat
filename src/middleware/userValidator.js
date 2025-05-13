import { StatusCodes } from "http-status-codes";
import User from "../models/UserModel.js";

const validateUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate("favoriteExercises");

    if (!user) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: "Invalid or deleted user",
      });
    }

    req.currentUser = user;
    next();
  } catch (error) {
    console.error("User validation failed:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Error validating user",
    });
  }
};

export default validateUser;
