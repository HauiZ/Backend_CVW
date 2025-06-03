import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config();

export const generateAccessToken = (user) => {
  return jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "1h" }); // Token sẽ hết hạn sau 1 giờ
};

export const generateRefreshToken = (user) => {
  return jwt.sign(user, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" }); // Token sẽ hết hạn sau 7 ngày
};
