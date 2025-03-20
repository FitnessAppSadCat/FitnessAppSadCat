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
    name: {
      type: String,
      required: [true, "Please provide full name"],
      minlength: 3,
      maxlength: 35,
    },

    surname: { type: String, required: true }, 
    // username: { type: String, required: true, unique: true }, // никнейм
    phone: {
      type: String,
     
      match: [/^\+?[1-9]\d{1,14}$/, "Please provide a valid phone number"],
    },
    role: { type: String, enum: ["user", "trainer", "admin"], default: "user" },// what admin shoul do?
    gender: { type: String, enum: ["male", "female", "other"] }, //  null явно указывает, что поле не было заполнено. Это полезно для проверки в коде, чтобы отличить "поле не заполнено" от "поле заполнено пустой строкой или другим значением.
    weight: { type: Number},  // нужно проверять наличие данных перед созданием тренировки.
    dateOfBirth: { type: Date},
    fitnessLevel: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],

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
    },

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
    { userId: this._id, name: this.name },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_LIFETIME }
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
  const isMatch = await bcrypt.compare(enteredPassword, this.password);
  return isMatch;
};

// added to check if user exist

userSchema.statics.checkExistUser = async function (body) {
  const { email, password } = body;

  if (!email || !password) {
    return null;
  }

  const user = await this.findOne({ email });
  if (!user) {
    return null;
  }

  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    return null;
  }

  return user;

};


const User = mongoose.model("User", userSchema);
export default User;




    // Str.Goal commented 
    // subscription: {
    //   type: String,
    //   enum: ["free", "premium", "expired"],
    //   default: "free",
    // },
    // avatarUrl: { type: String, default: "" },
    // friends: { // post MVP
    //   type: [mongoose.Schema.Types.ObjectId], // post MVP
    //   ref: "User", // post MVP
    //   default: [],// post MVP
    // },
    // devices: { type: [String], default: [] }, // post MVP
    // achievements: { type: [String], default: [] },  // post MVP
    // medicalConditions: { type: [String], default: [] }, // post MVP
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

// как вариант я думала о предписанных значениях
// const allowedAges = [20, 21, 22, 23, 24, 25 и тд]; // Добавьте все  значения

// age: {
//   type: Number,
//   required: true,
//   validate: {
//     validator: function (value) {
//       return allowedAges.includes(value);
//     },
//     message: "Age must be one of the following: 18 - 120", // Сообщение об ошибке
//   },
// },