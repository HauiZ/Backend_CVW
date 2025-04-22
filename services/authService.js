import User from '../models/User.js';
import Role from '../models/Role.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
import messages from '../config/message.js';

const loginUser = async (email, password, roleName) => {
    try {
        const user = await User.findOne({
            where: { email },
            include: [{ model: Role, attributes: ["name"], where: {name: roleName} }]
        });

        if (!user) {
            return { status: 401, data: { message: messages.auth.ERR_WRONG_ACCOUNT_OR_PASSWORD } };
        }
        // const isMatch = await bcrypt.compare(password, user.password);
        if (password !== user.password) {
            return { status: 401, data: { message: messages.auth.ERR_WRONG_ACCOUNT_OR_PASSWORD } };
        }

        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        return {
            status: 200,
            data: {
                message: messages.auth.LOGIN_SUCCESS,
                token,
            }
        };
    } catch (error) {
        return { status: 500, data: { message: messages.error.ERR_INTERNAL} };
    }
};

export default { loginUser };