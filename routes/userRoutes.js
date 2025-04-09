import express from 'express';
const router = express.Router();
import { login, registerCandidate, registerRecruiter, getProfile, getUsers } from '../controllers/userController.js';
import authMiddleware from '../middleware/authMiddleware.js';



/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Đăng nhập
 *     tags: [Users]
 *     description: API để đăng nhập người dùng
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
router.post('/login', login);

/**
 * @swagger
 * /api/users/registerCandidate:
 *   post:
 *     summary: Đăng ký tài khoản candidate
 *     tags: [Users]
 *     description: API để đăng ký tài khoản người dùng mới
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "user@example.com"
 *               username:
 *                 type: string
 *                 example: "username"
 *               password:
 *                 type: string
 *                 example: "password123"
 *               confirmpassword:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       201:
 *         description: Đăng ký thành công
 */
router.post('/registerCandidate', registerCandidate);

/**
 * @swagger
 * /api/users/registerRecruiter:
 *   post:
 *     summary: Đăng ký tài khoản recruiter
 *     tags: [Users]
 *     description: API để đăng ký tài khoản người dùng mới
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *               confirmpassword:
 *                 type: string
 *                 example: "password123"
 *               BusinessName: 
 *                 type: string
 *                 example: "BusinessName"
 *               phone:
 *                 type: string
 *                 example: "phone"
 *               province: 
 *                 type: string
 *                 example: "province"
 *               district: 
 *                 type: string
 *                 example: "district"
 *               domain:
 *                 type: string
 *                 example: "domain"
 *     responses:
 *       201:
 *         description: Đăng ký thành công
 */
router.post('/registerRecruiter', registerRecruiter);

/**
 * @swagger
 * /api/users/getProfile:
 *   get:
 *     summary: Lấy thông tin cá nhân
 *     tags: [Users]
 *     description: API lấy thông tin người dùng (cần xác thực)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/getProfile', authMiddleware(['candidate', 'recruiter']), getProfile);

/**
 * @swagger
 * /api/users/getUsers:
 *   get:
 *     summary: Lấy thông tin Users
 *     tags: [Users]
 *     description: API lấy thông tin người dùng (cần xác thực)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/getUsers', authMiddleware(['admin']), getUsers);

// /**
//  * @swagger
//  * /api/users/registerAdmin:
//  *   post:
//  *     summary: Đăng ký tài khoản administrator
//  *     tags: [Users]
//  *     description: API để đăng ký tài khoản người dùng mới
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               email:
//  *                 type: string
//  *                 example: "user@example.com"
//  *               password:
//  *                 type: string
//  *                 example: "password123"
//  *               confirmpassword:   
//  *                 type: string
//  *                 example: "password123" 
//  *     responses:
//  *       201:
//  *         description: Đăng ký thành công
//  */
// router.post('/registerAdmin', registerAdmin);
export default router;
