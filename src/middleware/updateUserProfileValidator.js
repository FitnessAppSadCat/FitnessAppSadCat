import { body, validationResult } from "express-validator";

export const validateProfileUpdate = [
  body("age")
    .optional()
    .isInt({ min: 10, max: 100 })
    .withMessage("Age must be an integer between 10 and 100"),

  body("weight")
    .optional()
    .isFloat({ min: 30, max: 300 })
    .withMessage("Weight must be a number between 30 and 300 lbs"),

  body("fitnessLevel")
    .optional()
    .isIn(["Beginner", "Intermediate", "Advanced"])
    .withMessage("Fitness level must be Beginner, Intermediate or Advanced"),

  body("gender")
    .optional()
    .isIn(["Male", "Female"])
    .withMessage("Gender must be Male or Female or Other"),
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
