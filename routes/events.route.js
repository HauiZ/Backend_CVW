import express from 'express';
const router = express.Router();
import {collect} from '../controllers/eventsController.js';
import authMiddleware from '../middleware/authMiddleware.js';
router.post('/collect', authMiddleware(['candidate']), collect);
export default router;
