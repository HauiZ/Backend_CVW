const express = require('express');
const userRoutes = require('./routes/userRoutes');
require('dotenv').config();
const { sequelize } = require('./models');
const { swaggerUi, swaggerSpec } = require('./config/swaggerConfig');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api/users', userRoutes);

sequelize.sync({ alter: true }).then(() => {
    console.log('✅ Database đã kết nối!');
    app.listen(3000, () => console.log('🚀 Server chạy tại http://localhost:3000/api-docs'));
}).catch(err => console.error('❌ Lỗi kết nối database:', err));

