
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import authService from '../services/authService.js';

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await authService.loginUser(email, password);
    res.status(result.status).json(result.data);
} catch (error) {
    console.error("Lỗi đăng nhập (controller):", error);
    res.status(500).json({ message: "Lỗi máy chủ!" });
}
};

export const googleCallback = async (req, res) => {
  try {
    const user = req.user;

    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.redirect(`http://localhost:5173/authsuccess?token=${token}`);
  } catch (error) {
    console.error('Lỗi trong quá trình xác thực Google:', error);
    res.status(500).json({ message: 'Đã xảy ra lỗi trong quá trình xác thực' });
  }
}
