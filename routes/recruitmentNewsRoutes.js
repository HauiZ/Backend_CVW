import express from 'express';
const router = express.Router();
import authMiddleware from '../middleware/authMiddleware.js';
import { getRecruitmentNews, filterRecruitmentNews } from '../controllers/recruitmentNewsController.js';

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
 * /api/recruitmentNews/filerRecruitmentNews:
 *   get:
 *     summary: Lọc danh sách tin tuyển dụng
 *     tags: [RecruitmentNews]
 *     description: API để lọc danh sách tin tuyển dụng dựa trên các tiêu chí khác nhau (tất cả đều là tùy chọn).
 *     parameters:
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *         description: Từ khóa để tìm kiếm trong tiêu đề công việc, chuyên môn hoặc tên công ty.
 *       - in: query
 *         name: jobTitle
 *         schema:
 *           type: string
 *         description: Tiêu đề công việc để lọc (có thể là một chuỗi hoặc một mảng các chuỗi).
 *       - in: query
 *         name: area
 *         schema:
 *           type: string
 *         description: Khu vực (tỉnh/thành phố) để lọc.
 *       - in: query
 *         name: experience
 *         schema:
 *          type: string
 *         description: Yêu cầu kinh nghiệm để lọc.
 *       - in: query
 *         name: jobLevel
 *         schema:
 *           type: string
 *         description: Cấp bậc công việc để lọc.
 *       - in: query
 *         name: salaryMin
 *         schema:
 *           type: integer
 *           format: int32
 *         description: Mức lương tối thiểu để lọc.
 *       - in: query
 *         name: salaryMax
 *         schema:
 *           type: integer
 *           format: int32
 *         description: Mức lương tối đa để lọc.
 *       - in: query
 *         name: workType
 *         schema:
 *           type: string
 *         description: Loại hình công việc để lọc.
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [experience, salary, datePosted]
 *         description: Trường để sắp xếp (mặc định là datePosted).
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *         description: Thứ tự sắp xếp (mặc định là DESC).
 *     responses:
 *       200:
 *         description: Danh sách tin tuyển dụng đã được lọc thành công.
 */
router.get('/filterRecruitmentNews', authMiddleware(['candidate']), filterRecruitmentNews);
export default router;