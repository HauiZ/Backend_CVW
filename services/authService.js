import User from '../models/User.js';
import Role from '../models/Role.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
import messages from '../config/message.js';
import { generateAccessToken, generateRefreshToken } from "../utils/generateToken.js";

const loginUser = async (email, password, roleName) => {
    try {
        const user = await User.findOne({
            where: { email },
            include: [{ model: Role, attributes: ["name"], where: { name: roleName } }]
        });

        if (!user) {
            return { status: 401, data: { message: messages.auth.ERR_WRONG_ACCOUNT_OR_PASSWORD } };
        }
        // const isMatch = await bcrypt.compare(password, user.password);
        if (password !== user.password) {
            return { status: 401, data: { message: messages.auth.ERR_WRONG_ACCOUNT_OR_PASSWORD } };
        }

        const payload = { id: user.id, email: user.email };
        const accessToken = generateAccessToken(payload);
        const refreshToken = generateRefreshToken(payload);

        return {
            status: 200,
            data: {
                message: messages.auth.LOGIN_SUCCESS,
                accessToken,
                refreshToken,
            }
        };
    } catch (error) {
        return { status: 500, data: { message: messages.error.ERR_INTERNAL } };
    }
};

export default { loginUser };