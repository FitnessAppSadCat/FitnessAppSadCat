import { StatusCodes } from "http-status-codes";
import User from "../models/UserModel.js";

export const getUserInfo = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      "firstName gender age weight fitnessLevel"
    );

    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(StatusCodes.OK).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Error fetching user info:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Server error while fetching user info",
    });
  }
};

export const getUsersCount = async (req, res) => {
  try {
    const count = await User.countDocuments();
    res.status(StatusCodes.OK).json({
      success: true,
      totalUsers: count,
    });
  } catch (error) {
    console.error("Error counting users:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Server error while counting users",
    });
  }
};
