import express from 'express';
const router = express.Router();
import authMiddleware from '../middleware/authMiddleware.js';
import { postRecruitmentNews } from '../controllers/recruiterController.js';

/**
 * @swagger
 * /api/recruiter/postRecruitmentNews:
 *   post:
 *     summary: Đăng tin tuyển dụng
 *     tags: [Recruiter]
 *     security:
 *      - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - jobTitle
 *               - profession
 *               - candidateNumber
 *               - jobLevel
 *               - workType
 *               - province
 *               - district
 *               - domain
 *               - jobAddress
 *               - salaryMin
 *               - salaryMax
 *               - experience
 *               - workDateIn
 *               - workDetail
 *               - jobRequirements
 *               - benefits
 *               - applicationDealine
 *               - contactInfo
 *               - contactAddress
 *               - contactPhone
 *               - contactEmail
 *             properties:
 *               jobTitle:
 *                 type: string
 *                 example: Backend Developer
 *               profession:
 *                 type: string
 *                 example: IT
 *               candidateNumber:
 *                 type: integer
 *                 example: 3
 *               jobLevel:
 *                 type: string
 *                 example: Mid-level
 *               workType:
 *                 type: string
 *                 example: Full-time
 *               province:
 *                 type: string
 *                 example: Hà Nội
 *               district:
 *                 type: string
 *                 example: Nam Từ Liêm
 *               domain:
 *                 type: string
 *                 example: Backend
 *               jobAddress:
 *                 type: string
 *                 example: Số 1, Trần Duy Hưng, Cầu Giấy, Hà Nội
 *               salaryMin:
 *                 type: integer
 *                 example: 1500
 *               salaryMax:
 *                 type: integer
 *                 example: 2500
 *               salaryNegotiable:
 *                 type: boolean
 *                 example: true
 *               experience:
 *                 type: string
 *                 example: 2 năm
 *               workDateIn:
 *                 type: string
 *                 format: date
 *                 example: 2025-05-01
 *               workDetail:
 *                 type: object
 *                 example:
 *                   description: Tham gia phát triển REST API
 *                   techStack: [Node.js, PostgreSQL, Sequelize]
 *               jobRequirements:
 *                 type: string
 *                 example: Thành thạo Node.js, Express
 *               benefits:
 *                 type: object
 *                 example:
 *                   bonus: "Thưởng Tết"
 *                   insurance: true
 *                   activities: ["Team building", "Du lịch"]
 *               applicationDealine:
 *                 type: string
 *                 format: date
 *                 example: 2025-06-30
 *               contactInfo:
 *                 type: string
 *                 example: Nguyễn Văn A
 *               contactAddress:
 *                 type: string
 *                 example: Tòa nhà XYZ, quận Cầu Giấy
 *               contactPhone:
 *                 type: string
 *                 example: "0987654321"
 *               contactEmail:
 *                 type: string
 *                 format: email
 *                 example: hr@company.com
 *               videoUrl:
 *                 type: string
 *                 example: https://www.youtube.com/watch?v=xyz123
 *     responses:
 *       200:
 *         description: Post success.
 */
router.post('/postRecruitmentNews', authMiddleware(['recruiter']), postRecruitmentNews);
export default router;
