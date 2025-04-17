import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 1433, 
    dialect: 'mssql',
    timezone: '+07:00',
    logging: console.log,
    dialectOptions: {
        options: {
            encrypt: true, 
            trustServerCertificate: true,
        },
    },
    pool: {
        max: 20, // Số lượng kết nối tối đa trong pool
        min: 0, // Số lượng kết nối tối thiểu trong pool
        acquire: 30000, // Thời gian tối đa (ms) để chờ lấy một kết nối từ pool
        idle: 10000 // Thời gian tối đa (ms) một kết nối có thể nhàn rỗi trước khi được giải phóng
    }
});

sequelize.authenticate()
    .then(() => {
        console.log('Kết nối thành công!');
    })
    .catch(err => {
        console.error('Không thể kết nối đến cơ sở dữ liệu:', err);
    });

export default sequelize;