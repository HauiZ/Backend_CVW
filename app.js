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
import authRoutes from './routes/authRoutes.js';
import './config/passport.js';
import corsOptions from './config/corsConfig.js';
import securityHeaders from './middleware/securityHeaders.js';

const app = express();
app.use(express.json());
app.use(securityHeaders);
app.use(cors(corsOptions));
app.use(passport.initialize());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api/users', userRoutes);
app.use('/api/recruitmentNews', recruitmentNewsRoutes);
app.use('/api', authRoutes);

sequelize.sync({ alter: true }).then(() => {
    console.log('✅ Database đã kết nối!');
    app.listen(3000, () => console.log('🚀 Server chạy tại http://localhost:3000/api-docs'));
}).catch(err => console.error('❌ Lỗi kết nối database:', err));

