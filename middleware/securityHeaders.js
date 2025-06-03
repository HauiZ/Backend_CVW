const securityHeaders = (req, res, next) => {
    res.setHeader("Cross-Origin-Opener-Policy", "same-origin"); // Cho phép chia sẻ tài nguyên giữa các nguồn gốc cùng miền
    res.setHeader("Cross-Origin-Embedder-Policy", "require-corp"); // Yêu cầu các tài nguyên được nhúng phải có cùng nguồn gốc hoặc được chia sẻ
    next();
};

export default securityHeaders;