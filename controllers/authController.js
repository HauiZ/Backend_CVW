import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

export const googleCallback = async (req, res) => {
  try {
    const user = req.user;
    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Cách 1: Redirect kèm token lên frontend (dùng query param)
    res.redirect(`http://localhost:5173/authsuccess?token=${token}`);
    
  } catch (error) {
    console.error('Lỗi trong quá trình xác thực Google:', error);
    res.status(500).json({ message: 'Đã xảy ra lỗi trong quá trình xác thực' });
  }
}
