# Backend CVW - Hệ thống Tuyển dụng & Tìm việc Thông minh

Đây là backend API cho hệ thống tuyển dụng và tìm việc thông minh CVW, được xây dựng bằng Node.js, Python và Express.js.

## 🚀 Tính năng chính

### Quản lý người dùng
- Đăng ký tài khoản (Ứng viên/Nhà tuyển dụng)
- Đăng nhập với email/password
- Đăng nhập bằng Google OAuth 2.0
- Quản lý thông tin cá nhân
- Đổi mật khẩu
- Quên mật khẩu (OTP qua email)

### Quản lý tin tuyển dụng
- Đăng tin tuyển dụng
- Cập nhật tin tuyển dụng
- Xóa tin tuyển dụng
- Tìm kiếm và lọc tin tuyển dụng theo:
  - Từ khóa
  - Chuyên môn
  - Khu vực
  - Kinh nghiệm
  - Cấp bậc
  - Mức lương
  - Loại hình công việc
- Sắp xếp theo: kinh nghiệm, lương, ngày đăng
- Hệ thống tự động gợi ý các tin tuyển dụng phù hợp (tính năng thông minh)

### Quản lý ứng tuyển
- Ứng viên ứng tuyển vào vị trí
- Nhà tuyển dụng xem danh sách ứng viên
- Duyệt/từ chối ứng viên
- Theo dõi trạng thái ứng tuyển

### Quản lý CV
- Tạo CV từ template
- Upload CV
- Quản lý template CV
- Xem chi tiết CV

### Quản lý công ty
- Xem thông tin công ty
- Danh sách công ty
- Thông tin chi tiết công ty

### Thông báo
- Hệ thống thông báo cho ứng viên
- Hệ thống thông báo cho nhà tuyển dụng

### Dashboard
- Thống kê cho admin
- Thống kê cho nhà tuyển dụng

## 📋 Yêu cầu hệ thống

- Node.js (phiên bản mới nhất)
- SQL Server
- Tài khoản Google Cloud Platform (cho OAuth)
- Tài khoản email (cho gửi OTP)

## 🛠 Cài đặt

1. Clone repository:
```bash
git clone [https://github.com/HauiZ/Backend_CVW.git]
cd Backend_CVW
```

2. Cài đặt dependencies:
```bash
npm install
```

3. Tạo file `.env` trong thư mục gốc và cấu hình các biến môi trường:
```env
# Database
DB_HOST=your_db_host
DB_PORT=your_port
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name

# JWT
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_token_secret

# Google OAuth
CVW_GOOGLE_CLIENT_ID=your_google_client_id
CVW_GOOGLE_CLIENT_SECRET=your_google_client_secret
CVW_GOOGLE_REFRESH_TOKEN=your_refresh_token

# Email
MY_EMAIL_ACCOUNT=your_email_account
NODEMAILER_APP_PASSWORD=your_app_password

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Docker
SA_DOCKER_PASSWORD=your_docker_password
SA_DOCKER_NAME=your_docker_name

# Fush config
EVENT_FLUSH_SIZE=10(tùy chọn)
EVENT_FLUSH_MS=10000(tùy chọn)
IMPRESSION_SAMPLE_RATE=1(tùy chọn)
```

4. Tạo JSON Key dành cho Service Account (hay còn gọi là private key)
```bash
# Đưa json key vào thư mục config\googleDrive điều chỉnh keyFile driveConfig.js để nhận json key
```

5. Chạy database migrations (tùy chọn):
```bash
# Kiểm tra file scriptSQL.txt, seed_users.sql, seed_jobs.sql để biết thêm chi tiết
```

6. Khởi động server:
```bash
node app
```

7. Khởi động Model gợi ý thông minh:
```bash
cd Model
py api.py
```

## 📁 Cấu trúc thư mục

```
Backend_CVW/
├── config/             # Cấu hình database và các service
├── controllers/        # Logic xử lý request
├── data/               # dataset Model
├── helper/             # Các hàm tiện ích
├── middleware/         # Middleware (auth, upload, etc.)
├── Model/              # Model gợi ý tin tuyển dụng thông minh 
├── models/             # Database models
├── public/             # Static files
├── routes/             # API routes
├── scripts/            # Scrips functions
├── services/           # Business logic
├── utils/              # Utility functions
├── docker-compose.yml/ # Docker
├── app.js              # Entry point
└── package.json        # Project dependencies
```

## 🔧 Công nghệ sử dụng

### Backend Framework & Runtime
- **Node.js**: JavaScript runtime
- **Express.js**: Web framework
- **Sequelize**: ORM cho SQL Server
- **Python**: Model gợi ý thông minh

### Database
- **MSSQL**: Database system
- **Tedious**: SQL Server driver

### Authentication & Security
- **JWT**: Xác thực người dùng
- **Passport.js**: Authentication middleware
- **Google OAuth 2.0**: Đăng nhập bằng Google
- **bcryptjs**: Mã hóa mật khẩu
- **Cookie-parser**: Parse cookie headers

### API & Documentation
- **Swagger**: API documentation
- **CORS**: Cross-origin resource sharing
- **Body-parser**: Parse request bodies

### Email & File Handling
- **Nodemailer**: Gửi email
- **Multer**: Upload file
- **Cloudinary**: Cloud storage cho file

## 📚 API Documentation

API documentation có sẵn tại `/api-docs` sau khi khởi động server, bao gồm:
- Chi tiết các endpoints
- Request/Response schemas
- Authentication requirements
- Example requests

## 🔐 Bảo mật

- JWT cho xác thực và refresh token
- CORS được cấu hình
- Cookie security
- Environment variables cho sensitive data
- Role-based access control (RBAC)
- Input validation và sanitization

## 📝 License

ISC License