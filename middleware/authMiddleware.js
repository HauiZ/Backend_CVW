const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Role = require("../models/Role");
require("dotenv").config();

const authMiddleware = (roles = []) => {
  return async (req, res, next) => {
    const token = req.header("Authorization");
    if (!token) return res.status(401).json({ message: "Không có token, từ chối truy cập" });

    try {
      // Giải mã token
      const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
      req.user = decoded;

      // Lấy danh sách role của user từ database
      const user = await User.findByPk(req.user.id, {
        include: [{ model: Role, attributes: ["name"] }],
      });

      if (!user) return res.status(404).json({ message: "Người dùng không tồn tại" });

      // Lấy danh sách role của user
      const userRoles = user.Roles.map(role => role.name);

      // Kiểm tra nếu user có ÍT NHẤT MỘT role hợp lệ
      if (roles.length && !roles.some(role => userRoles.includes(role))) {
        return res.status(403).json({ message: "Không có quyền truy cập" });
      }

      next();
    } catch (error) {
      res.status(401).json({ message: "Token không hợp lệ" });
    }
  };
};

module.exports = authMiddleware;
