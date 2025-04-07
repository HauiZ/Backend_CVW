import express from 'express';
const router = express.Router();
import authMiddleware from '../middleware/authMiddleware.js';
import { getRecruitmentNews, sortRecruitmentNews, filterRecruitmentNews} from '../controllers/recruitmentNewsController.js';

/**
 * @swagger
 * /api/recruitmentNews/getRecruitmentNews:
 *   get:
 *     summary: Lấy thông tin tin tuyển dụng
 *     tags: [RecruitmentNews]
 *     description: API lấy tin tuyển dụng
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/getRecruitmentNews', getRecruitmentNews);

/**
 * @swagger
 * /api/recruitmentNews/sortRecruitmentNews:
 *   post:
 *     summary: Sắp xếp tin tuyển dụng
 *     tags: [RecruitmentNews]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sortBy:
 *                 type: string
 *                 enum: [experience, salary, datePosted]
 *                 description: Trường để sắp xếp
 *               order:
 *                 type: string
 *                 enum: [ASC, DESC]
 *                 description: Hướng sắp xếp
 *     responses:
 *       201:
 *         description: Sắp xếp thành công
 */
router.post('/sortRecruitmentNews', authMiddleware(['candidate']), sortRecruitmentNews);
export default router;