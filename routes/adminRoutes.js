import express from 'express';
const router = express.Router();
import { getRequest, getUsers, deleteUser, approveRecruitment, uploadCvTemplate, getDataDashBorad } from "../controllers/adminController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import upload from '../middleware/uploadFile.js';

/**
 * @swagger
 * /api/admin/getUsers:
 *   get:
 *     summary: Lấy thông tin Users
 *     tags: [Admin]
 *     description: API lấy thông tin người dùng (cần xác thực)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/getUsers', authMiddleware(['admin']), getUsers);

/**
 * @swagger
 * /api/admin/deleteUser/{id}:
 *  delete:
 *    summary: Xóa người dùng theo ID (cần xác thực và quyền admin)
 *    tags: [Admin]
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

/**
 * @swagger
 * /api/admin/getRequest:
 *   get:
 *     summary: Lấy các Request
 *     tags: [Admin]
 *     description: API lấy thông tin Request (cần xác thực)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/getRequest', authMiddleware(['admin']), getRequest);


/**
 * @swagger
 * /api/admin/approveRecruitment/{id}:
 *   patch:
 *     summary: Duyệt tin tuyển dụng
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của request.
 *         schema:
 *           type: integer
 *           format: int64
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum:
 *                   - PENDING
 *                   - APPROVED
 *                   - REJECTED
 *     responses:
 *       200:
 *         description: Duyệt tin tuyển dụng thành công
 */
router.patch('/approveRecruitment/:id', authMiddleware(['admin']), approveRecruitment);

/**
 * @swagger
 * /api/admin/uploadCvTemplate:
 *   post:
 *     summary: Tải lên CV Template
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
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
 *               name:
 *                 type: string
 *                 example: "Cao cấp"
 *               url:
 *                 type: string
 *                 example: "http://localhost::5173/template1"
 *               propoties:
 *                 type: array
 *                 example: ["cao cấp", "tinh tế", "sang trọng"]    
 *     responses:
 *       200:
 *         description: Upload thành công
 *       400:
 *         description: Không có file
 *       500:
 *         description: Lỗi server
 */
router.post('/uploadCvTemplate', authMiddleware(['admin']), upload.imageUpload.single('file'), uploadCvTemplate);


/**
 * @swagger
 * /api/admin/getDataDashBorad:
 *   get:
 *     summary: Lấy thông tin Dashboard
 *     tags: [Admin]
 *     description: API lấy thông tin Dashboard
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/getDataDashBorad', authMiddleware(['admin']), getDataDashBorad);

export default router;