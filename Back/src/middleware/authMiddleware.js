import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "Unauthorized: Missing token" });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "Unauthorized: Empty token" });
  }

  if (!process.env.JWT_SECRET) {
    console.error("JWT_SECRET is not defined in environment variables");
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal server error" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      id: decoded.userId,
      username: decoded.username,
      role: decoded.role, // пишем опять таки, если надо
    };
    next();
  } catch (err) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "Unauthorized: Invalid token" });
  }
}

export default authMiddleware;

/*
тут я просто немного модифицировал твой вариант под наш проект.
надо дописывать Autification тут или в другой сделаем Middleware? 
*/
