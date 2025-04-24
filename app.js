import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import models from './models/index.js';
const { sequelize } = models;
import { swaggerUi, swaggerSpec } from './config/swaggerConfig.js';
import userRoutes from './routes/userRoutes.js';
import recruitmentNewsRoutes from './routes/recruitmentNewsRoutes.js';
import passport from 'passport';
import cookieParser from "cookie-parser";
import authRoutes from './routes/authRoutes.js';
import './config/passport.js';
import corsOptions from './config/corsConfig.js';
import securityHeaders from './middleware/securityHeaders.js';
import resetPasswordRoutes from './routes/resetPasswordRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import recruiterRoutes from './routes/recruiterRoutes.js';

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(securityHeaders);
app.use(cors(corsOptions));
app.use(passport.initialize());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api/users', userRoutes);
app.use('/api/recruitmentNews', recruitmentNewsRoutes);
app.use('/api', authRoutes);
app.use('/api', resetPasswordRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/recruiter', recruiterRoutes);
sequelize.sync({ alter: true }).then(() => {
    console.log('✅ Database đã kết nối!');
    app.listen(3000, () => console.log('🚀 Server chạy tại http://localhost:3000/api-docs'));
}).catch(err => console.error('❌ Lỗi kết nối database:', err));

