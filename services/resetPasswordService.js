import nodemailer from 'nodemailer';
import User from '../models/User.js';
import Role from '../models/Role.js';
import dotenv from 'dotenv';
import { textEmail, htmlEmail } from '../public/EmailTemplate.js';
dotenv.config();

const forgotPassword = async (dataUser, roleName) => {
    try {
        const { email, otpCode, newPassword, confirmPassword } = dataUser;
        const user = await User.findOne({
            where: { email: email, typeAccount: 'LOCAL' },
            include: [{ model: Role, attributes: ["name"], where: { name: roleName } }]
        });
        if (user) {
            if (otpCode !== user.otpCode) {
                return { status: 400, data: { message: `Sai otpCode` } };
            }
            if (new Date() > user.otpExpiresAt) {
                return { status: 400, data: { message: "Mã OTP đã hết hạn" } };
              }
            if (!newPassword || !confirmPassword) {
                return { status: 400, data: { message: "Vui lòng nhập đầy đủ mật khẩu và xác nhận mật khẩu" } };
            }
            if (newPassword !== confirmPassword) {
                return { status: 400, data: { message: "Mật khẩu xác nhận không khớp" } };
            }
            if (newPassword.length < 6) {
                return { status: 400, data: { message: "Mật khẩu phải có ít nhất 6 ký tự" } };
            }
            await user.update({ password: newPassword, otpCode: null, otpExpiresAt: null });
            return { status: 200, data: { message: `Mật khẩu đã được cập nhật, vui lòng đăng nhập lại` } };
        }
        return { status: 400, data: { message: `Email không tồn tại!` } };
    } catch (error) {
        console.error("Lỗi server(service):", error);
        return { status: 500, data: { message: `Lỗi server(service): `, error } };
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
            const otpCode = Math.floor(100000 + Math.random() * 9000);
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
            return { status: 200, data: { message: `Message sent: %s: ${info.messageId}` } };
        }
        return { status: 400, data: { message: `Email không tồn tại!` } };
    } catch (error) {
        return { status: 500, data: { message: `Lỗi server(service): `, error } };
    }

};

export default { forgotPassword, sendOTPCode };
