import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Role from "../models/Role.js";
import dotenv from 'dotenv';
dotenv.config();

const authMiddleware = (roles = []) => {
  return async (req, res, next) => {
    const token = req.header("Authorization");
    if (!token) return res.status(401).json({ message: "Không có token, từ chối truy cập" });

    try {
      // Giải mã token
      const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
      req.user = decoded;

      // Lấy thông tin user và role từ database
      const user = await User.findByPk(req.user.id, {
        include: [{ model: Role, attributes: ["name"] }],
      });

      if (!user) return res.status(404).json({ message: "Người dùng không tồn tại" });

      // Kiểm tra role của user
      const userRole = user.Role ? user.Role.name : null;

      // Kiểm tra nếu user có role hợp lệ
      if (roles.length && !roles.includes(userRole)) {
        return res.status(403).json({ message: "Không có quyền truy cập" });
      }

      next();
    } catch (error) {
      res.status(401).json({ message: "Token không hợp lệ" });
    }
  };
};

export default authMiddleware;
