import User from '../models/User.js';
import Role from '../models/Role.js';
import PersonalUser from '../models/PersonalUser.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import CompanyUser from '../models/CompanyUser.js';
import Area from '../models/Area.js';
import sequelize from '../config/database.js';

const registerUser = async (userData, roleName) => {
    const transaction = await sequelize.transaction();
    try {
        const { username, email, password, confirmpassword, BusinessName, phone, province, district, domain } = userData;

        const role = await Role.findOne({ where: { name: roleName }, transaction });
        if (!role) {
            return { status: 400, data: { message: `Quyền ${roleName} không tồn tại trong hệ thống` } };
        }

        if (!password || !confirmpassword) {
            return { status: 400, data: { message: "Vui lòng nhập đầy đủ mật khẩu và xác nhận mật khẩu" } };
        }
        if (password !== confirmpassword) {
            return { status: 400, data: { message: "Mật khẩu xác nhận không khớp" } };
        }
        if (password.length < 6) {
            return { status: 400, data: { message: "Mật khẩu phải có ít nhất 6 ký tự" } };
        }

        const uniqueEmail = await User.findOne({
            where: { email: email },
            include: [{ model: Role, where: { name: roleName } }]
            , transaction
        });

        if (uniqueEmail && uniqueEmail.Role) {
            return { status: 400, data: { message: `Email đã tồn tại với quyền ${roleName}` } };
        }

        // const saltRounds = 10;
        // const hashedPassword = await bcrypt.hash(password, saltRounds);

        const user = await User.create({ email, password }, { transaction });
        await user.setRole(role, { transaction });
        const token = jwt.sign({ id: user.id, email: user.email, role: role.name }, process.env.JWT_SECRET, { expiresIn: "1h" });
        const responseData = { message: `Đăng ký thành công với quyền ${roleName}`, token };

        if (roleName === "candidate") {
            const personalUser = await PersonalUser.create({ userId: user.id, name: username, email }, { transaction });
            responseData.personalUser = personalUser;
        } else if (roleName === "recruiter") {
            let area = await Area.findOne({ where: { province, district, domain }, transaction });
            if (!area) {
                area = await Area.create({ province, district, domain }, { transaction });
            }
            const companyUser = await CompanyUser.create({ userId: user.id, name: BusinessName, email, phone, areaId: area.id }, { transaction });
            responseData.companyUser = companyUser;
        }

        await transaction.commit();
        return { status: 201, data: responseData };

    } catch (error) {
        if (!transaction.finished) {
            await transaction.rollback();
        }
        return { status: 500, data: { message: "Lỗi đăng ký (service):", error } };
    }
};

const getUserProfile = async (userId) => {
    try {
        const user = await User.findByPk(userId, {
            attributes: { exclude: ['password'] },
            include: [
                { model: Role, as: 'Role', attributes: ["name"] },
                { model: PersonalUser, as: 'PersonalUser' },
                { model: CompanyUser, as: 'CompanyUser', include: [{ model: Area, as: 'Area' }] }
            ]
        });

        if (!user) {
            return { status: 404, data: { message: 'Người dùng không tồn tại!' } };
        }

        const userRole = user.Role.name;
        const userInfo = { id: user.id, email: user.email, role: userRole };

        if (userRole === 'candidate' && user.PersonalUser) {
            userInfo.personalUser = { username: user.PersonalUser.name, email: user.PersonalUser.email, phone: user.PersonalUser.phone };
        }

        if (userRole === 'recruiter' && user.CompanyUser) {
            userInfo.companyUser = {
                businessName: user.CompanyUser.name,
                email: user.CompanyUser.email,
                phone: user.CompanyUser.phone,
                area: user.CompanyUser.Area ? { id: user.CompanyUser.Area.id, province: user.CompanyUser.Area.province, district: user.CompanyUser.Area.district, domain: user.CompanyUser.Area.domain } : null
            };
        }

        return { status: 200, data: { message: 'Lấy thông tin thành công!', user: userInfo } };

    } catch (error) {
        return { status: 500, data: { message: "Lỗi lấy thông tin người dùng (service):", error } };
    }
};

const getAllUsers = async () => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ["password"] },
            include: [{ model: Role, attributes: ["name"] }]
        });

        if (!users.length) {
            return { status: 404, data: { message: "Không có người dùng nào!" } };
        }

        const userList = users.map(user => ({ id: user.id, email: user.email, role: user.Role.name }));
        return { status: 200, data: { message: "Lấy danh sách người dùng thành công!", users: userList } };

    } catch (error) {
        return { status: 500, data: { message: "Lỗi lấy danh sách user (service):", error } };
    }
};

const deleteAUser = async (userId) => {
    try {
        const userToDelete = await User.findByPk(userId, {
            include: [{ model: Role, attributes: ["name"] }] 
        });
        if (!userToDelete) {
            return {status: 404, data: {message: "Không tìm thấy người dùng!"}}
        }
        if (userToDelete.Role.name === 'admin'){
            return {status: 201, data: {message: 'Không thể xóa admin!!!'}}
        }
        await userToDelete.destroy();
        return {status: 200, data: {message: `Đã xóa người dùng có ID: ${userId} thành công!`}}
    } catch (error) {
        return {status: 500, data: {message: 'Lỗi server khi xóa người dùng.', error}};
    }
}

export default { registerUser, getUserProfile, getAllUsers, deleteAUser };