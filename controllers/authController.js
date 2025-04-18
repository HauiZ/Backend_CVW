
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import authService from '../services/authService.js';
import messages from '../config/message.js';

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const {roleName} = req.params;
    const result = await authService.loginUser(email, password, roleName);
    res.status(result.status).json(result.data);
} catch (error) {
    console.error("Lỗi đăng nhập (controller):", error);
    res.status(500).json({ message: messages.error.ERR_INTERNAL });
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
    res.status(500).json({ message: messages.error.ERR_INTERNAL });
  }
}
