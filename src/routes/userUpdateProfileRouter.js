import express from "express";
import updateUserProfile from "../controllers/updateUserProfileController.js";
import authenticateUser from "../middleware/authMiddleware.js";
import {
  validateProfileUpdate,
  handleValidationErrors,
} from "../middleware/updateUserProfileValidator.js";
const router = express.Router();

router.patch(
  "/",
  authenticateUser,
  validateProfileUpdate,
  handleValidationErrors,
  updateUserProfile
);

export default router;
