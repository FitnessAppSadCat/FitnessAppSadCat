import { body, validationResult } from "express-validator";

export const validateWorkoutParams = [
  body("age")
    .isInt({ min: 10, max: 100 })
    .withMessage("Age must be integer between 10-100")
    .toInt(),

  body("weight")
    .isFloat({ min: 30, max: 300 })
    .withMessage("Weight must be number between 30-300 kg")
    .toFloat(),

  body("level")
    // .trim()
    // .toLowerCase()
    .isIn(["Beginner", "Intermediate", "Advanced"])
    .withMessage("Invalid workout level"),

  body("gender")
    // .trim()
    // .toLowerCase()
    .isIn(["Male", "Female", "Other"])
    .withMessage("Invalid gender specified"),
];

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }
  next();
};
