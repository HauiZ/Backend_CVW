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

const registerUser = async (userData, roleName) => {
    const transaction = await sequelize.transaction();
    try {
        const { userName, email, password, confirmPassword, BusinessName, phone, province, district, domain } = userData;

        const role = await Role.findOne({ where: { name: roleName }, transaction });
        if (!role) {
            return { status: 400, data: { message: `PERMISSION ${roleName} NOT IN SYSTEM` } };
        }

        if (!password || !confirmPassword) {
            return { status: 400, data: { message: messages.auth.ERR_ENTER_PASSWORD } };
        }
        if (password !== confirmPassword) {
            return { status: 400, data: { message: messages.auth.ERR_MATCH_PASSWORD } };
        }
        if (password.length < 6) {
            return { status: 400, data: { message: messages.auth.ERR_LEAST_PASSWORD } };
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
            const personalUser = await PersonalUser.create({ userId: user.id, name: userName, email }, { transaction });
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

const getAllUsers = async () => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ["password"] },
            include: [{ model: Role, attributes: ["name"] }]
        });

        if (!users.length) {
            return { status: 404, data: { message: messages.user.ERR_USER_NOT_EXISTS } };
        }

        const userList = users.map(user => ({ id: user.id, email: user.email, role: user.Role.name }));
        return { status: 200, data: { message: messages.user.GET_INFO, users: userList } };

    } catch (error) {
        return { status: 500, data: { message: messages.error.ERR_INTERNAL, error } };
    }
};

const deleteAUser = async (userId) => {
    try {
        const userToDelete = await User.findByPk(userId, {
            include: [
                { model: Role, attributes: ['name'] },
                { model: PersonalUser, attributes: ['avatarId']},
            ],
        });
        if (!userToDelete) {
            return { status: 404, data: { message: messages.user.ERR_USER_NOT_EXISTS } }
        }
        if (userToDelete.Role.name === 'admin') {
            return { status: 201, data: { message: messages.error.ERR_DELETE_ADMIN } }
        }
        const cvFilesToDelete = await CvFiles.findAll({
            where: {
                personalId: userId
            },
        });

        if (cvFilesToDelete && cvFilesToDelete.length > 0) {
            for (const cvFile of cvFilesToDelete) {
                const googleDriveFileId = cvFile.fileId;
                await drive.files.delete({
                    fileId: googleDriveFileId
                },);
            }
        }

        if ( userToDelete.PersonalUser.avatarId !== null) {
            const googleDriveFileId = userToDelete.PersonalUser.avatarId;
            await drive.files.delete({
                fileId: googleDriveFileId
            },);
        }
        await userToDelete.destroy();
        return { status: 200, data: { message: `DELETED: ${userId} SUCCESSFULLY!` } }
    } catch (error) {
        console.log(error)
        return { status: 500, data: { message: messages.error.ERR_INTERNAL, error } };
    }
};

export default { registerUser, getUserProfile, getAllUsers, deleteAUser };