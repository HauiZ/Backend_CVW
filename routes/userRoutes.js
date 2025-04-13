import express from 'express';
const router = express.Router();
import {  registerCandidate, registerRecruiter, getProfile, getUsers, deleteUser } from '../controllers/userController.js';
import authMiddleware from '../middleware/authMiddleware.js';


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
 *               userName:
 *                 type: string
 *                 example: "userName"
 *               password:
 *                 type: string
 *                 example: "password123"
 *               confirmPassword:
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
 *               confirmPassword:
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

/**
 * @swagger
 * /api/users/deleteUser/{id}:
 *  delete:
 *    summary: Xóa người dùng theo ID (cần xác thực và quyền admin)
 *    tags: [Users]
 *    description: API để xóa một người dùng cụ thể dựa trên ID. Yêu cầu xác thực và quyền admin.
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        description: ID của người dùng cần xóa.
 *        schema:
 *          type: integer
 *          format: int64
 *    responses:
 *      200:
 *        description: Người dùng đã được xóa thành công.
 */
router.delete('/deleteUser/:id', authMiddleware(['admin']), deleteUser);
export default router;
