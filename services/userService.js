import User from '../models/User.js';
import Role from '../models/Role.js';
import PersonalUser from '../models/PersonalUser.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import CompanyUser from '../models/CompanyUser.js';
import Area from '../models/Area.js';
import sequelize from '../config/database.js';
import CvFiles from '../models/CvFiles.js';
import drive from "../config/googleDrive/driveconfig.js";
import messages from '../config/message.js';
import checkFormatPassword from '../helper/fomatPassword.js';

const registerUser = async (userData, roleName) => {
    const transaction = await sequelize.transaction();
    try {
        const { userName, email, password, confirmPassword, BusinessName, phone, province, district, domain } = userData;

        const role = await Role.findOne({ where: { name: roleName }, transaction });
        if (!role) {
            return { status: 400, data: { message: `PERMISSION ${roleName} NOT IN SYSTEM` } };
        }

        const checkPass = checkFormatPassword(password, confirmPassword);
        if (checkPass !== true) {
            if (!transaction.finished) {
                await transaction.rollback();
            }
            return { status: checkPass.status, data: { message: checkPass.data } }
        }

        const uniqueEmail = await User.findOne({
            where: { email: email },
            include: [{ model: Role, where: { name: roleName } }]
            , transaction
        });

        if (uniqueEmail && uniqueEmail.Role) {
            return { status: 400, data: { message: `EMAIL DOES EXISTS WITH PERMISSION ${roleName}` } };
        }

        // const saltRounds = 10;
        // const hashedPassword = await bcrypt.hash(password, saltRounds);

        const user = await User.create({ email, password, typeAccount: 'LOCAL' }, { transaction });
        await user.setRole(role, { transaction });
        const token = jwt.sign({ id: user.id, email: user.email, role: role.name }, process.env.JWT_SECRET, { expiresIn: "1h" });
        const responseData = { message: messages.user.USER_CREATED_SUCCESSFULLY, token };

        if (roleName === "candidate") {
            await PersonalUser.create({ userId: user.id, name: userName, email }, { transaction });
        } else if (roleName === "recruiter") {
            let area = await Area.findOne({ where: { province, district, domain }, transaction });
            if (!area) {
                area = await Area.create({ province, district, domain }, { transaction });
            }
            await CompanyUser.create({ userId: user.id, name: BusinessName, email, phone, areaId: area.id }, { transaction });
        }

        await transaction.commit();
        return { status: 200, data: responseData };

    } catch (error) {
        if (!transaction.finished) {
            await transaction.rollback();
        }
        return { status: 500, data: { message: messages.error.ERR_INTERNAL, error } };
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
            return { status: 404, data: { message: messages.user.ERR_USER_NOT_EXISTS } };
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

        return { status: 200, data: { message: messages.user.GET_INFO, user: userInfo } };

    } catch (error) {
        return { status: 500, data: { message: messages.error.ERR_INTERNAL, error } };
    }
};

const changePassword = async (userId, newPasswordData) => {
    try {
        const { oldPassword, newPassword, confirmNewPassword } = newPasswordData;
        const user = await User.findByPk(userId);
        if (oldPassword !== user.password) {
            return { status: 400, data: { message: messages.auth.ERR_INCORRECT_PASSWORD } };
        }
        const checkPass = checkFormatPassword(newPassword, confirmNewPassword);
        if (checkPass !== true) {
            return { status: checkPass.status, data: { message: checkPass.data } }
        }
        await user.update({ password: newPassword });
        return { status: 200, data: { message: messages.auth.CHANGE_PASSWORD_SUCCESS } };
    } catch (error) {
        console.log(error)
        return { status: 500, data: { message: messages.error.ERR_INTERNAL } }
    }
};

const changeProfile = async (userId, dataProfile) => {
    try {
        const { name, phone, province, district, domain, field, companySize, website, introduction } = dataProfile;
        if (!name) {
            return { status: 201, data: { message: messages.user.BLANK_NAME } };
        }
        if (!province || !district || !domain) {
            return { status: 201, data: { message: messages.user.BLANK_AREA } };
        }
        const user = await User.findByPk(userId, {
            include: [{ model: Role, attributes: ['name'] }]
        });
        if (user.Role.name === 'candidate') {
            const personal = await PersonalUser.findByPk(userId);
            const updates = {name, phone};
            for (const field of Object.keys(updates)) {
                if (updates[field] !== personal[field]) {
                    await personal.update({ [field]: updates[field] });
                }
            }
        } else if (user.Role.name === 'recruiter') {
            const company = await CompanyUser.findByPk(userId, {
                include: [{ model: Area }],
            })
            const area = {province, district, domain};
            for (const field of Object.keys(area)) {
                if (area[field] !== company.Area[field]) {
                    await company.update({ [field]: area[field] });
                }
            }
            const updates = { name, phone, field, companySize, website, introduction };
            for (const field of Object.keys(updates)) {
                if (updates[field] !== company[field]) {
                    await company.update({ [field]: updates[field] });
                }
            }
        }
        return {status: 200, data: {message : messages.user.USER_UPDATED_SUCCESSFULLY}};
    } catch (error) {
        console.log(error);
        return { status: 500, data: { message: messages.error.ERR_INTERNAL, error } };
    }
};
export default { registerUser, getUserProfile, changePassword, changeProfile };