import User from '../models/User.js';
import Role from '../models/Role.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const loginUser = async (email, password, roleName) => {
    try {
        const adminUser = await User.findOne({
            where: { email },
            include: [{ model: Role, attributes: ["name"], where: {name: 'admin'} }]
        });
        if (adminUser) {
            const adminToken = jwt.sign(
                { id: adminUser.id, email: adminUser.email },
                process.env.JWT_SECRET,
                { expiresIn: "1h" }
            );
    
            return {
                status: 200,
                data: {
                    message: "Đăng nhập thành công!",
                    adminToken,
                    user: {
                        id: adminUser.id,
                        email: adminUser.email,
                        role: adminUser.Role.name,
                    },
                }
            };
        }
        const user = await User.findOne({
            where: { email },
            include: [{ model: Role, attributes: ["name"], where: {name: roleName} }]
        });

        if (!user) {
            return { status: 401, data: { message: "Sai tài khoản hoặc mật khẩu!" } };
        }
        // const isMatch = await bcrypt.compare(password, user.password);
        if (password !== user.password) {
            return { status: 401, data: { message: "Sai tài khoản hoặc mật khẩu!" } };
        }

        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        return {
            status: 200,
            data: {
                message: "Đăng nhập thành công!",
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    role: user.Role.name,
                },
            }
        };
    } catch (error) {
        return { status: 500, data: { message: "Lỗi đăng nhập (service):", error} };
    }
};

export default { loginUser };