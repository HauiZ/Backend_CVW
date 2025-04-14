import express from 'express';
const router = express.Router();
import { getRequest, getUsers, deleteUser, getRecruitmentNews, approveRecruitment  } from "../controllers/adminController.js";
import authMiddleware from "../middleware/authMiddleware.js";

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
 * /api/admin/getRecruitmentNews/{id}:
 *  get:
 *    summary: Lấy thông tin tin tuyển dụng cần xác thực
 *    tags: [Admin]
 *    description: Lấy thông tin tin tuyển dụng cần xác thực.
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        description: ID của tin tuyển dụng.
 *        schema:
 *          type: integer
 *          format: int64
 *    responses:
 *      200:
 *        description: Lấy tin tuyển dụng thành công.
 */
router.get('/getRecruitmentNews/:id', authMiddleware(['admin']), getRecruitmentNews);

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
 *         description: ID của tin tuyển dụng.
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

export default router;