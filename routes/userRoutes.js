const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');



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
router.post('/login', userController.login);

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
router.post('/registerCandidate', userController.registerCandidate);

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
router.post('/registerRecruiter', userController.registerRecruiter);

/**
 * @swagger
 * /api/users/profile:
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
router.get('/profile', authMiddleware(['candidate', 'recruiter']), userController.profile);

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
router.get('/getUsers', authMiddleware(['admin']), userController.getUsers);

/**
 * @swagger
 * /api/users/registerAdmin:
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
router.post('/registerAdmin', userController.registerAdmin);
module.exports = router;
