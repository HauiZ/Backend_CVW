import express from 'express';
const router = express.Router();
import authMiddleware from '../middleware/authMiddleware.js';
import { getRecruitmentNews, filterRecruitmentNews} from '../controllers/recruitmentNewsController.js';

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
 * /api/recruitmentNews/filterRecruitmentNews:
 *   get:
 *     summary: Lọc thông tin tin tuyển dụng
 *     tags: [RecruitmentNews]
 *     description: API lọc tin tuyển dụng
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/filterRecruitmentNews',authMiddleware(['candidate']) ,filterRecruitmentNews);
export default router;