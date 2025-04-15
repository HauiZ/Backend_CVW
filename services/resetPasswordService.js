import nodemailer from 'nodemailer';
import User from '../models/User.js';
import Role from '../models/Role.js';
import dotenv from 'dotenv';
import { textEmail, htmlEmail } from '../public/EmailTemplate.js';
dotenv.config();
import messages from '../config/message.js';
import checkFormatPassword from '../helper/fomatPassword.js';

const forgotPassword = async (dataUser, roleName) => {
    try {
        const { email, otpCode, newPassword, confirmNewPassword } = dataUser;
        const user = await User.findOne({
            where: { email: email, typeAccount: 'LOCAL' },
            include: [{ model: Role, attributes: ["name"], where: { name: roleName } }]
        });
        if (user) {
            if (otpCode !== user.otpCode) {
                return { status: 400, data: { message: messages.auth.ERR_WRONG_OTP } };
            }
            if (new Date() > user.otpExpiresAt) {
                return { status: 400, data: { message: messages.auth.ERR_OTP_EXPIRED } };
            }
            const checkPass = checkFormatPassword(newPassword, confirmNewPassword);
            if (checkPass !== true) {
                return { status: checkPass.status, data: { message: checkPass.data } }
            }
            await user.update({ password: newPassword, otpCode: null, otpExpiresAt: null });
            return { status: 200, data: { message: messages.auth.UPDATE_PASSWORD_SUCCESS } };
        }
        return { status: 400, data: { message: messages.auth.ERR_EXISTS_EMAIL } };
    } catch (error) {
        console.error("Lỗi server(service):", error);
        return { status: 500, data: { message: messages.error.ERR_INTERNAL } };
    }
};

const sendOTPCode = async (userEmail, roleName) => {
    try {
        const user = await User.findOne({
            where: { email: userEmail, typeAccount: 'LOCAL' },
            include: [{ model: Role, attributes: ["name"], where: { name: roleName } }]
        });
        if (user) {
            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    type: "OAuth2",
                    user: process.env.MY_EMAIL_ACCOUNT,
                    clientId: process.env.CVW_GOOGLE_CLIENT_ID,
                    clientSecret: process.env.CVW_GOOGLE_CLIENT_SECRET,
                    refreshToken: process.env.CVW_GOOGLE_REFRESH_TOKEN,
                },
            });
            const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
            const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
            // send mail with defined transport object
            const info = await transporter.sendMail({
                from: `"CV Website" <${process.env.MY_EMAIL_ACCOUNT}>`,
                to: userEmail,
                subject: "Yêu cầu khôi phục mật khẩu từ CV Website",
                text: textEmail(userEmail, otpCode),
                html: htmlEmail(userEmail, otpCode),
            });
            await user.update({ otpCode: otpCode, otpExpiresAt: expiresAt });
            return { status: 200, data: { message: messages.mail.SEND_OTP_SUCCESS } };
        }
        return { status: 400, data: { message: messages.auth.ERR_EXISTS_EMAIL } };
    } catch (error) {
        return { status: 500, data: { message: messages.error.ERR_INTERNAL } };
    }

};

export default { forgotPassword, sendOTPCode };
