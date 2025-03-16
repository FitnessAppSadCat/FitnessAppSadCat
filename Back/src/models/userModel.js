import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Please provide email"],
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please provide valid email",
      ],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Please provide password"],
      minlength: 6,
    },
    name: { type: String, required: true },
    surname: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    phone: {
      type: String,
      default: "",
      match: [/^\+?[1-9]\d{1,14}$/, "Please provide a valid phone number"],
    },
    role: { type: String, enum: ["user", "trainer", "admin"], default: "user" },
    gender: { type: String, enum: ["male", "female", "other"], required: true },
    weight: { type: Number, required: true },
    height: { type: Number, required: true },
    dateOfBirth: { type: Date, required: true },
    fitnessLevel: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      required: true,
    },
    // createdAt: { type: Date, default: Date.now },
    favoriteWorkouts: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Workout",
      default: [],
    },
    refreshToken: { type: String, default: "" },

    //  селать связь для дашбоард по колличеству выполненных
    goal: {
      type: String,
      enum: ["weight loss", "muscle gain", "maintenance"],
      required: true,
    },
    // Str.Goal
    subscription: {
      type: String,
      enum: ["free", "premium", "expired"],
      default: "free",
    },
    avatarUrl: { type: String, default: "" },
    friends: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
    devices: { type: [String], default: [] },
    achievements: { type: [String], default: [] },
    medicalConditions: { type: [String], default: [] },
  },
  { timestamps: true }
);

// Перед сохранением автоматически хешируем пароль
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

//  Метод для создания JWT-токена
userSchema.methods.createJWT = function () {
  return jwt.sign(
    { userId: this._id, username: this.username },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );
};
// для перезахода
userSchema.methods.createRefreshToken = function () {
  return jwt.sign({ userId: this._id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });
};
// Метод для сравнения пароля при логине
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;

/*
вопросы и дополнения:
1. userSchema.index({ role: 1 });
userSchema.index({ fitnessLevel: 1 }); - можно использовать для более быстрой обработки во фронт, но пока избыточно, как я думаю
2. поставить лимит на любимые упражнения ... 
favoriteWorkouts: {
  type: [mongoose.Schema.Types.ObjectId],
  ref: "Workout",
  default: [],
  validate: [arrayLimit, "Too many favorite workouts"],
},

на подобии такого 
function arrayLimit(val) {
  return val.length <= 50;
}
  (классно, что претир работает на комментарии.)


  сделать валидацию возраста, во избежание ошибок и всякого 
  dateOfBirth: {
  type: Date,
  required: true,
  validate: {
    validator: function (value) {
      const age = (new Date() - value) / (1000 * 60 * 60 * 24 * 365.25);
      return age >= 13 && age <= 80;
    },
    message: "Age must be between 13 and 120 years",
  },
},
мне все равно, но для Дена можно показать
*/
