import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

// Tạo kết nối để kiểm tra và tạo database
const createDatabaseIfNotExists = async () => {
    const masterConnection = new Sequelize('', process.env.DB_USER, process.env.DB_PASSWORD, {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT || 1433,
        dialect: 'mssql',
        timezone: '+07:00',
        logging: false, // Tắt logging cho kết nối master
        dialectOptions: {
            options: {
                encrypt: true,
                trustServerCertificate: true,
            },
        },
    });

    try {
        // Kiểm tra xem database có tồn tại không
        const [results] = await masterConnection.query(
            `SELECT name FROM sys.databases WHERE name = '${process.env.DB_NAME}'`
        );

        if (results.length === 0) {
            // Database chưa tồn tại, tạo mới
            console.log(`Database '${process.env.DB_NAME}' chưa tồn tại. Đang tạo...`);
            await masterConnection.query(`CREATE DATABASE [${process.env.DB_NAME}]`);
            console.log(`Database '${process.env.DB_NAME}' đã được tạo thành công!`);
        } else {
            console.log(`Database '${process.env.DB_NAME}' đã tồn tại.`);
        }
    } catch (error) {
        console.error('Lỗi khi kiểm tra/tạo database:', error);
        throw error;
    } finally {
        await masterConnection.close();
    }
};

// Tạo kết nối chính đến database JobPortal
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

// Hàm khởi tạo kết nối
const initializeDatabase = async () => {
    try {
        // Kiểm tra và tạo database nếu cần
        await createDatabaseIfNotExists();
        
        // Kết nối đến database
        await sequelize.authenticate();
        console.log('Kết nối thành công!');
        
        return sequelize;
    } catch (error) {
        console.error('Không thể kết nối đến cơ sở dữ liệu:', error);
        throw error;
    }
};

initializeDatabase();

export default sequelize;