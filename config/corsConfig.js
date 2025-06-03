const corsOptions = {
    origin: 'http://localhost:5173', // Địa chỉ của frontend
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Các phương thức HTTP được phép
    credentials: true, // Cho phép cookie được gửi theo yêu cầu
};
export default corsOptions;