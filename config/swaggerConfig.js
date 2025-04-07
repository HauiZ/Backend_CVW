import swaggerJSDoc from'swagger-jsdoc';
import swaggerUi from'swagger-ui-express';

// Cấu hình Swagger
const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "API Documentation",
            version: "1.0.0",
            description: "Tài liệu API cho dự án của bạn",
        },
        servers: [
            {
                url: "http://localhost:3000", // Đổi port nếu cần
                description: "Local server"
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            }
        },
    },
    apis: ["./routes/*.js"], // Đường dẫn tới các file routes
};

// Khởi tạo swaggerSpec
const swaggerSpec = swaggerJSDoc(swaggerOptions);

export { swaggerUi, swaggerSpec };
