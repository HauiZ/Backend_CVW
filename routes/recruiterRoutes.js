import express from 'express';
const router = express.Router();
import authMiddleware from '../middleware/authMiddleware.js';
import { postRecruitmentNews, getApplicant, approvedApplication, getNotification, getPostedRecruitmentNews, getDataDashBoard, updateRecruitmentNews, deleteRecruitmentNews } from '../controllers/recruiterController.js';

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
 *               - degree
 *               - province
 *               - district
 *               - jobAddress
 *               - salaryMin
 *               - salaryMax
 *               - experience
 *               - workDateIn
 *               - workDetail
 *               - jobRequirements
 *               - benefits
 *               - applicationDeadline
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
 *               degree:
 *                 type: string
 *                 example: Thạc sỹ
 *               province:
 *                 type: string
 *                 example: Hà Nội
 *               district:
 *                 type: string
 *                 example: Nam Từ Liêm
 *               jobAddress:
 *                 type: string
 *                 example: Số 1, Trần Duy Hưng, Cầu Giấy, Hà Nội
 *               salaryMin:
 *                 type: integer
 *                 example: 15000000
 *               salaryMax:
 *                 type: integer
 *                 example: 25000000
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
 *               applicationDeadline:
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

/**
 * @swagger
 * /api/recruiter/getApplicant:
 *   get:
 *     summary: Lấy thông tin ứng viên ứng tuyển
 *     tags: [Recruiter]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/getApplicant', authMiddleware(['recruiter']), getApplicant);

/**
 * @swagger
 * /api/recruiter/getApplicant/{id}:
 *   get:
 *     summary: Lấy thông tin ứng viên ứng tuyển
 *     tags: [Recruiter]
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
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/getApplicant/:id', authMiddleware(['recruiter']), getApplicant);

/**
 * @swagger
 * /api/recruiter/approvedApplication/{id}:
 *   post:
 *     summary: Duyệt yêu cầu ứng tuyển
 *     tags: [Recruiter]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của yêu cầu ứng tuyển.
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
 *         description: Duyệt tin yêu cầu ứng tuyển thành công
 */
router.post('/approvedApplication/:id', authMiddleware(['recruiter']), approvedApplication);

/**
 * @swagger
 * /api/recruiter/getNotification:
 *   get:
 *     summary: Lấy thông báo
 *     tags: [Recruiter]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/getNotification', authMiddleware(['recruiter']), getNotification);

/**
 * @swagger
 * /api/recruiter/getPostedRecruitmentNews:
 *   get:
 *     summary: Lấy các tin tuyển dụng đã đăng
 *     tags: [Recruiter]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/getPostedRecruitmentNews', authMiddleware(['recruiter']), getPostedRecruitmentNews);

/**
 * @swagger
 * /api/recruiter/getDataDashBoard:
 *   get:
 *     summary: Lấy thông tin dashboard
 *     tags: [Recruiter]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/getDataDashBoard', authMiddleware(['recruiter']), getDataDashBoard);

/**
 * @swagger
 * /api/recruiter/updateRecruitmentNews/{id}:
 *   post:
 *     summary: Chỉnh sửa tin tuyển dụng
 *     tags: [Recruiter]
 *     security:
 *      - bearerAuth: []
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
 *             required:
 *               - jobTitle
 *               - profession
 *               - candidateNumber
 *               - jobLevel
 *               - workType
 *               - degree
 *               - province
 *               - district
 *               - jobAddress
 *               - salaryMin
 *               - salaryMax
 *               - experience
 *               - workDateIn
 *               - workDetail
 *               - jobRequirements
 *               - benefits
 *               - applicationDeadline
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
 *               degree:
 *                 type: string
 *                 example: Thạc sỹ
 *               province:
 *                 type: string
 *                 example: Hà Nội
 *               district:
 *                 type: string
 *                 example: Nam Từ Liêm
 *               jobAddress:
 *                 type: string
 *                 example: Số 1, Trần Duy Hưng, Cầu Giấy, Hà Nội
 *               salaryMin:
 *                 type: integer
 *                 example: 15000000
 *               salaryMax:
 *                 type: integer
 *                 example: 25000000
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
 *               applicationDeadline:
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
router.post('/updateRecruitmentNews/:id', authMiddleware(['recruiter']), updateRecruitmentNews);

/**
 * @swagger
 * /api/recruiter/deleteRecruitmentNews/{id}:
 *  post:
 *    summary: Tạo yêu cầu xóa tin tuyển dụng theo ID (cần xác thực và quyền recruiter)
 *    tags: [Recruiter]
 *    description: API để tạo yêu cầu xóa một tin tuyển dụng cụ thể dựa trên ID. Yêu cầu xác thực và quyền recruiter.
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        description: ID của tin tuyển dụng cần xóa.
 *        schema:
 *          type: integer
 *          format: int64
 *    responses:
 *      200:
 *        description: Tin tuyển dụng đã được xóa thành công.
 */
router.post('/deleteRecruitmentNews/:id', authMiddleware(['recruiter']), deleteRecruitmentNews);
export default router;
