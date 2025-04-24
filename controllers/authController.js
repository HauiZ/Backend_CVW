
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import authService from '../services/authService.js';
import messages from '../config/message.js';
import { generateAccessToken, generateRefreshToken } from '../utils/generateToken.js';

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { roleName } = req.params;
    const result = await authService.loginUser(email, password, roleName);
    // Lưu refreshToken vào cookie
    res.cookie("refreshToken", result.data.refreshToken, {
      httpOnly: true,
      secure: true, // chỉ gửi qua HTTPS
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/"
    });
    return res.status(result.status).json({ message: result.data.message, token: result.data.accessToken });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: messages.error.ERR_INTERNAL });
  }
};

export const logout = (req, res) => {
  try {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      path: "/" // Đảm bảo path giống với khi bạn tạo cookie
    });
    
    return res.status(200).json({
      success: true,
      message: "Đăng xuất thành công"
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: messages.error.ERR_INTERNAL});
  }
};

export const refreshToken = (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.sendStatus(401);

  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const newAccessToken = generateAccessToken({ id: decoded.id, email: decoded.email });
    res.json({ accessToken: newAccessToken });
  } catch (err) {
    res.sendStatus(403);
  }
};

export const googleCallback = async (req, res) => {
  try {
    const user = req.user;
    const payload = { id: user.id, email: user.email };
    const token = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);
    // Lưu refreshToken vào cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true, // chỉ gửi qua HTTPS
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/"
    });
    return res.redirect(`http://localhost:5173/authsuccess?token=${token}`);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: messages.error.ERR_INTERNAL });
  }
};
