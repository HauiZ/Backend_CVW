import express from 'express';
import passport from 'passport';
import { googleCallback, login } from '../controllers/authController.js';

const router = express.Router();

/**
 * @swagger
 * /api/auth/login/{roleName}:
 *   post:
 *     summary: Đăng nhập
 *     tags: [Users]
 *     description: API để đăng nhập người dùng
 *     parameters:
 *      - in: path
 *        name: roleName
 *        required: true
 *        description: role cần đăng nhập.
 *        schema:
 *          type: string
 *          enum: [candidate, recruiter, admin]
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
 *               password:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Đăng nhập thành công
 */
router.post('/auth/login/:roleName', login);

router.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'], prompt: 'select_account', session: false})
);

router.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login', session: false }),
  googleCallback
);

export default router;
