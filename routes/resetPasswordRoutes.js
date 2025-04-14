import express from 'express';
const router = express.Router();
import { forgotPassword, sendOTPCode } from '../controllers/resetPasswordController.js';

/**
 * @swagger
 * /api/forgot-password/{roleName}:
 *   patch:
 *     summary: Quên mật khẩu
 *     tags: [Users]
 *     description: API để đổi mật khẩu
 *     parameters:
 *      - in: path
 *        name: roleName
 *        required: true
 *        description: role cần đăng nhập.
 *        schema:
 *          type: string
 *          enum: [candidate, recruiter]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "test@example.com"
 *               otpCode:
 *                 type: string
 *                 example: "123456"
 *               newPassword:
 *                 type: string
 *                 example: "password123"
 *               confirmNewPassword:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Đăng nhập thành công
 */
router.patch('/forgot-password/:roleName', forgotPassword);

/**
 * @swagger
 * /api/sendOTPCode/{roleName}:
 *   post:
 *     summary: Gửi mã OTP
 *     tags: [Users]
 *     description: API để gửi mã OTP
 *     parameters:
 *      - in: path
 *        name: roleName
 *        required: true
 *        description: role cần đăng nhập.
 *        schema:
 *          type: string
 *          enum: [candidate, recruiter]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "testgmail.com"
 *     responses:
 *       200:
 *         description: Đăng nhập thành công
 */
router.post('/sendOTPCode/:roleName', sendOTPCode);
export default router;