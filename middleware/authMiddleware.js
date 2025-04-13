import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Role from "../models/Role.js";
import dotenv from 'dotenv';
import messages from "../config/message.js";
dotenv.config();

const authMiddleware = (roles = []) => {
  return async (req, res, next) => {
    const token = req.header("Authorization");
    if (!token) return res.status(401).json({ message: messages.auth.ERR_TOKEN_MISSING });

    try {
      // Giải mã token
      const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
      req.user = decoded;

      // Lấy thông tin user và role từ database
      const user = await User.findByPk(req.user.id, {
        include: [{ model: Role, attributes: ["name"] }],
      });

      if (!user) return res.status(404).json({ message: messages.user.ERR_USER_NOT_FOUND });

      // Kiểm tra role của user
      const userRole = user.Role ? user.Role.name : null;

      // Kiểm tra nếu user có role hợp lệ
      if (roles.length && !roles.includes(userRole)) {
        return res.status(403).json({ message: messages.auth.ERR_TOKEN_INVALID });
      }

      next();
    } catch (error) {
      res.status(401).json({ message: messages.auth.ERR_NO_PERMISSION });
    }
  };
};

export default authMiddleware;
