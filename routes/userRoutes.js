import express from 'express';
const router = express.Router();
import {  registerCandidate, registerRecruiter, getProfile, changePassword, changeProfile, applyJob } from '../controllers/userController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadFile.js';

/**
 * @swagger
 * /api/users/registerCandidate:
 *   post:
 *     summary: Đăng ký tài khoản candidate
 *     tags: [Users]
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
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/getProfile', authMiddleware(['candidate', 'recruiter']), getProfile);



// /**
//  * @swagger
//  * /api/users/registerAdmin:
//  *   post:
//  *     summary: Đăng ký tài khoản administrator
//  *     tags: [Users]
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
 * /api/users/changePassword:
 *   patch:
 *     summary: Đổi mật khẩu
 *     tags: [Users]
 *     security:
 *      - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 example: "password123"
 *               newPassword:
 *                 type: string
 *                 example: "password123"
 *               confirmNewPassword:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Đổi mật khẩu thành công
 */
router.patch('/changePassword', authMiddleware(['candidate', 'recruiter']) ,changePassword);

/**
 * @swagger
 * /api/users/changeProfile:
 *   patch:
 *     summary: Đổi thông tin profile
 *     tags: [Users]
 *     security:
 *      - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "name"
 *               phone:
 *                 type: string
 *                 example: "0123456789"
 *               province:
 *                 type: string
 *                 example: "Tp.HCM"
 *               district: 
 *                 type: string
 *                 example: "Quận 9"
 *               domain:
 *                 type: string
 *                 example: "Nam"
 *               companyAddress:
 *                 type: string
 *                 example: "số 219, Man Thiện, Quận 9, Hồ Chí Minh" 
 *               field: 
 *                 type: string
 *                 example: "Công nghệ thông tin"
 *               companySize: 
 *                 type: string
 *                 example: "500-1000 người"
 *               website:
 *                 type: string
 *                 example: "https://cvwebsite.com"
 *               introduction:
 *                 type: object
 *                 example:
 *                   description: "Chúng tôi là một công ty công nghệ hàng đầu chuyên phát triển các giải pháp phần mềm."
 *                   techStack: ["Node.js", "React", "MongoDB"]
 *                   mission: "Cung cấp các sản phẩm chất lượng cao và dịch vụ khách hàng tuyệt vời."
 *                   values:
 *                     - "Đổi mới sáng tạo"
 *                     - "Tin cậy"
 *                     - "Hợp tác"
 *     responses:
 *       201:
 *         description: Đăng ký thành công
 */
router.patch('/changeProfile',authMiddleware(['candidate', 'recruiter']) , changeProfile);

/**
 * @swagger
 * /api/users/applyJob/{id}:
 *   post:
 *     summary: Ứng tuyển
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        description: ID của tin tuyển dụng.
 *        schema:
 *          type: integer
 *          format: int64
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Upload thành công
 *       400:
 *         description: Không có file
 *       500:
 *         description: Lỗi server
 */
router.post('/applyJob/:id', authMiddleware(['candidate']), upload.pdfUpload.single('file'), applyJob);
export default router;
