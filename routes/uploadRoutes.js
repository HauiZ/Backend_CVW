import express from 'express';
const router = express.Router();
import {uploadCV, uploadAvatar, uploadLogoBussiness} from '../controllers/uploadController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadFile.js';

/**
 * @swagger
 * /api/upload/upload-cv:
 *   post:
 *     summary: Tải lên file CV
 *     tags: [Upload]
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
 *     responses:
 *       200:
 *         description: Upload thành công
 *       400:
 *         description: Không có file
 *       500:
 *         description: Lỗi server
 */
router.post('/upload-cv', authMiddleware(['candidate']), upload.pdfUpload.single('file'), uploadCV);

/**
 * @swagger
 * /api/upload/upload-avatar:
 *   post:
 *     summary: Tải lên ảnh đại diện
 *     tags: [Upload]
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
 *     responses:
 *       200:
 *         description: Upload thành công
 *       400:
 *         description: Không có file
 *       500:
 *         description: Lỗi server
 */
router.post('/upload-avatar', authMiddleware(['candidate']), upload.imageUpload.single('file'), uploadAvatar);

/**
 * @swagger
 * /api/upload/upload-logoBussiness:
 *   post:
 *     summary: Tải lên logo công ty
 *     tags: [Upload]
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
 *     responses:
 *       200:
 *         description: Upload thành công
 *       400:
 *         description: Không có file
 *       500:
 *         description: Lỗi server
 */
router.post('/upload-logoBussiness', authMiddleware(['recruiter']), upload.imageUpload.single('file'), uploadLogoBussiness);

export default router;