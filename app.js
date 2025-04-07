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

const app = express();
app.use(express.json());
const corsOptions = {
    origin: 'http://localhost:5173', 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Cho phép cookie được gửi theo yêu cầu
};
app.use((req, res, next) => {
    res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
    res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
    next();
});

app.use(cors(corsOptions));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api/users', userRoutes);
app.use('/api/recruitmentNews', recruitmentNewsRoutes);
app.use(passport.initialize()); 

app.use('/api', authRoutes);

sequelize.sync({ alter: true }).then(() => {
    console.log('✅ Database đã kết nối!');
    app.listen(3000, () => console.log('🚀 Server chạy tại http://localhost:3000/api-docs'));
}).catch(err => console.error('❌ Lỗi kết nối database:', err));

