import User from "../models/userModel.js";
import userService from "../services/userServices.js";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";

// можно вставить в код, но там столько всего, что глаза устают. я бы так и для цветов делал
const loginAttempts = {}; // хранение попыток входа по IP (защита от brute-force)
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 минутное окно для счетчика попыток
const LOCK_TIME = 15 * 60 * 1000; // блокировка IP на 15 минут при превышении попыток

// register я убрала некоторые параметры, тк при регистрации только email, password, name, surname используем

//   проверила, все работает
async function register(req, res) {
  try {
    const { email, password, name, surname } = req.body;
    // Проверка обязательных полей
    if (!email || !password || !name || !surname) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Please provide all required fields" });
    }
    // Проверка существования email или username  
    // 
    // we are checking this in UserModel (95 str), I am not sure that we need this function


    const existingUser = await userService.findByEmailOrUsername(
      email,
      name,
      surname
    );
    if (existingUser) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Email or user already exists" });
    }
    // Создание нового пользователя
    const newUserData = {
      email,
      password,
      name,
      surname,
    };

    // Если phone не обязательное поле, можно использовать деструктуризацию с значением по умолчанию:
    // const { email, password, name, surname, username, phone = null } = req.body;
    // const newUserData = { email, password, name, surname, username, phone };
    // if (phone) {   
    //   newUserData.phone = phone;
    // }
    const user = await userService.createUser(newUserData);

    // Генерация JWT-токенов - я знаю, что ты сделал это в модели, но  я потом расскажу
    const accessToken = user.createJWT();
    const refreshToken = user.createRefreshToken();
    // Сохранение refresh-токена в базе
    user.refreshToken = refreshToken;
    await user.save();
    // Установка refresh-токена в httpOnly cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // пока мы работаем локально - лучше ставить так, что бы не было ошибки при обработке файлов , потом вернуть
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 дней
    });
    // Возвращаем данные пользователя и access-токен
    res.status(StatusCodes.CREATED).json({
      user: {
        id: user._id.toString(),
        name: user.name,
        surname: user.surname,
        // role: user.role, // это на потом для Дена
      },
      accessToken,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: error.message });
    }
    console.error("Register error:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Registration failed" });
  }
}


// login   
//   проверила, все работает


async function login(req, res) {
  try {
    const { email, password } = req.body;
    // Проверка наличия email и пароля
    if (!email || !password) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Email and password are required" });
    }
    const ip = req.ip;
    const now = Date.now();
    // Проверка, заблокирован ли IP из-за частых попыток - можно не ставить, но нас  теперь 8 человек потенциально проверяюзих всякое... и Денис
    if (
      loginAttempts[ip] && // так же я бы это поменял потом, что бы попытки хранились или в монго дб или в Redis . (лучше в Redis, но я пока что не помню, потом посмотрю)
      loginAttempts[ip].lockUntil &&
      now < loginAttempts[ip].lockUntil
    ) {
      return res
        .status(StatusCodes.TOO_MANY_REQUESTS)
        .json({ message: "Too many login attempts. Please try again later." });
    }
    // Поиск пользователя по email (с паролем для проверки)
    const user = await userService.findByEmail(email, true);
    if (!user || !(await user.comparePassword(password))) {
      // Неверные учетные данные - регистрируем попытку
      if (!loginAttempts[ip]) {
        loginAttempts[ip] = { count: 1, firstAttempt: now };
      } else {
        if (now - loginAttempts[ip].firstAttempt > WINDOW_MS) {
          // Сброс счетчика, если окно времени истекло
          loginAttempts[ip].count = 1;
          loginAttempts[ip].firstAttempt = now;
          delete loginAttempts[ip].lockUntil;
        } else {
          loginAttempts[ip].count += 1;
        }
      }
      // Блокировка при превышении допустимого количества попыток
      if (loginAttempts[ip].count >= MAX_ATTEMPTS) {
        loginAttempts[ip].lockUntil = now + LOCK_TIME;
        return res.status(StatusCodes.TOO_MANY_REQUESTS).json({
          message: "Too many login attempts. Please try again later.",
        });
      }
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "Invalid credentials" });
    }
    // Успешный вход - сброс счетчика попыток для IP
    if (loginAttempts[ip]) {
      delete loginAttempts[ip];
    }
    // Генерация новых токенов - дальше идет для того, что бы юзер заходил автоматически ( либо я в 2 часа ночи уже торможу, шутка)
    const accessToken = user.createJWT();
    const refreshToken = user.createRefreshToken();
    // Сохранение refresh-токена в базе
    user.refreshToken = refreshToken;
    await user.save();
    // Установка refresh-токена в cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // я пока что не делал env. так что могут быть разные имена. потом добавлю одно ( а потом поменяем на secure: true)
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 дней
    });
    res.status(StatusCodes.OK).json({
      user: {
        id: user._id.toString(),
        name: user.name,
        surname: user.surname,
        // role: user.role, // можно убрать , если не будем делать , но Ден вроде хотел
      },
      accessToken,
    });
  } catch (error) {
    console.error("Login error:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Login failed" });
  }
}


// logout
//   проверила, все работает

async function logout(req, res) {
  try {
    const { refreshToken } = req.cookies;
    if (refreshToken) {
      try {
        const decoded = jwt.verify(
          refreshToken,
          process.env.JWT_REFRESH_SECRET
        );

        await userService.updateUser(decoded.userId, { refreshToken: "" });
      } catch (err) {
        // токен недействителен или истек
      }
    }
    // Очистка refreshToken в cookie
    res.clearCookie("refreshToken", { httpOnly: true, sameSite: "Strict" });
    return res
      .status(StatusCodes.OK)
      .json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Logout failed" });
  }
}
//   проверила, все работает

async function checkToken(req, res) {
  try {
    // Предполагается, что authMiddleware установил req.user (я еще думаю над этим)
    const user = await userService.getUserById(req.user.id);
    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "User not found" });
    }
    res.status(StatusCodes.OK).json({
      user: {
        id: user._id,
        name: user.name,
        surname: user.surname,
        // role: user.role,
      },
    });
  } catch (error) {
    console.error("Check token error:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Token check failed" });
  }
}

async function forgotPassword(req, res) {
  try {
    const { email } = req.body;
    if (!email) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Please provide an email" });
    }
    const user = await userService.findByEmail(email);
    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "User not found" });
    }
    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 1000 * 60 * 30; //  30 минут
    await user.save();
    // Здесь должна отправляться ссылка на сброс пароля на email пользователя... будем делать?
    res
      .status(StatusCodes.OK)
      .json({ message: "Password reset link sent to email" });
  } catch (error) {
    console.error("Forgot password error:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Forgot password failed" });
  }
}

async function resetPassword(req, res) {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Token and new password are required" });
    }
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (!user) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Invalid or expired password reset token" });
    }
    // Установка нового пароля
    user.password = newPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();
    res
      .status(StatusCodes.OK)
      .json({ message: "Password has been reset successfully" });
  } catch (error) {
    if (error.name === "ValidationError") {
      // Новый пароль не прошел валидацию (слишком короткий и т.д.)
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: error.message });
    }
    console.error("Reset password error:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Reset password failed" });
  }
}

async function changePassword(req, res) {
  try {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Old and new password are required" });
    }
    const user = await userService.getUserByIdWithPassword(req.user.id);
    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "User not found" });
    }
    if (!(await user.comparePassword(oldPassword))) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "Old password is incorrect" });
    }
    // Установка нового пароля
    user.password = newPassword;
    await user.save();
    res
      .status(StatusCodes.OK)
      .json({ message: "Password updated successfully" });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: error.message });
    }
    console.error("Change password error:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Change password failed" });
  }
}

export {
  register,
  login,
  logout,
  checkToken,
  forgotPassword,
  resetPassword,
  changePassword,
};

/*
еще немного рассказов и предложений, помимо того , что сверху написал . 
1. можно сделать сюда функцию типа такой, но я пока писал отдельно код для каждой, так что там они будут повторяться. 
function sendTokens(res, user) {
  const accessToken = user.createJWT();
  const refreshToken = user.createRefreshToken();
  user.refreshToken = refreshToken;
  await user.save();
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
  });
  return { accessToken, user: { id: user._id, name: user.name, username: user.username, role: user.role } };
}
 */
