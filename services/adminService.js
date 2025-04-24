import Request from '../models/Request.js';
import messages from '../config/message.js';
import moment from 'moment-timezone';
import RecruitmentNews from '../models/RecruitmentNews.js';
import User from '../models/User.js';
import Role from '../models/Role.js';
import PersonalUser from '../models/PersonalUser.js';
import CvFiles from '../models/CvFiles.js';
import CompanyUser from '../models/CompanyUser.js';
import uploadToDrive from '../helper/uploadFile.js';
import CVTemplate from '../models/CVTemplate.js';
import Notification from '../models/Notification.js';
import { Op } from 'sequelize';

const getAllUsers = async (userId) => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ["password"] },
            include: [
                { model: Role, attributes: ["name"] },
                { model: CompanyUser, attributes: ["logoUrl"] },
                { model: PersonalUser, attributes: ["avatarUrl"] },
            ],
            where: { id: { [Op.ne]: userId } }
        });

        if (!users.length) {
            return { status: 404, data: { message: messages.user.ERR_USER_NOT_EXISTS } };
        }

        const userList = users.map(user => {
            const userData = {
                id: user.id,
                email: user.email,
                role: user.Role.name,
                imageUrl: null
            };

            if (user.Role.name === 'candidate') {
                userData.imageUrl = user.PersonalUser.avatarUrl;
            } else if (user.Role.name === 'recruiter') {
                if (user.Company) {
                    userData.imageUrl = user.CompanyUser.logoUrl;
                }
            }
            return userData;
        });
        return { status: 200, data: { message: messages.user.GET_INFO, users: userList } };

    } catch (error) {
        return { status: 500, data: { message: messages.error.ERR_INTERNAL } };
    }
};

const deleteAUser = async (userId) => {
    try {
        const userToDelete = await User.findByPk(userId, {
            include: [
                { model: Role, attributes: ['name'] },
                { model: PersonalUser, attributes: ['avatarId'] },
                { model: CompanyUser, attributes: ['logoId'] },
            ],
        });
        if (!userToDelete) {
            return { status: 404, data: { message: messages.user.ERR_USER_NOT_EXISTS } }
        }
        if (userToDelete.Role.name === 'admin') {
            return { status: 409, data: { message: messages.error.ERR_DELETE_ADMIN } }
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

        if (userToDelete.PersonalUser.avatarId !== null) {
            const googleDriveFileId = userToDelete.PersonalUser.avatarId;
            await drive.files.delete({
                fileId: googleDriveFileId
            },);
        }

        if (userToDelete.CompanyUser.logoId !== null) {
            const googleDriveFileId = userToDelete.PersonalUser.logoId;
            await drive.files.delete({
                fileId: googleDriveFileId
            },);
        }
        await userToDelete.destroy();
        return { status: 200, data: { message: `DELETED: ${userId} SUCCESSFULLY!` } }
    } catch (error) {
        console.log(error)
        return { status: 500, data: { message: messages.error.ERR_INTERNAL } };
    }
};

const getRequest = async (filterData) => {
    try {
        const { status, isReviewed } = filterData;
        const whereCondition = {};
        if (status !== undefined) whereCondition.status = status;
        if (isReviewed !== undefined) whereCondition.isReviewed = isReviewed;
        const requests = await Request.findAll({
            where: whereCondition
        });
        const requestList = requests.map(request => {
            const data = request.toJSON();
            return {
                ...data,
                createAt: moment(data.createAt).format('YYYY-MM-DD HH:mm:ss')
            };
        })
        return { status: 200, data: requestList };
    } catch (error) {
        return { status: 500, data: { message: messages.error.ERR_INTERNAL } };
    }
};

const approveRecruitment = async (requestId, status) => {
    try {
        const request = await Request.findByPk(requestId);
        const recruitmentNewId = request.recruitmentNewsId;
        const recruitmentNew = await RecruitmentNews.findByPk(recruitmentNewId, {
            attributes: ['id', 'companyId', 'status'],
            include: [{
                model: CompanyUser,
                attributes: ['name', 'userId'],
            }]
        });
        await recruitmentNew.update({ status: status });
        let content;
        if (status === messages.recruitmentNews.status.APPROVED) {
            content = messages.recruitmentNews.APPROVED_POST;
        } else if (status === messages.recruitmentNews.status.REJECTED) {
            content = messages.recruitmentNews.REJECTED_POST;
        }
        await Notification.create({
            sender: 'ADMIN',
            receiverId: recruitmentNew.CompanyUser.userId,
            receiver: recruitmentNew.CompanyUser.name,
            title: 'Job Posting Status Notifications',
            content: content,
        });
        await request.update({ status: status, isReviewed: true });
        return { status: 200, data: { message: messages.recruitmentNews.UPDATE_SUCCESS } };
    } catch (error) {
        console.log(error)
        return { status: 500, data: { message: messages.error.ERR_INTERNAL } };
    }
};

const uploadCvTemplate = async (data, file) => {
    try {
        const { name, url, propoties } = data;
        const parentId = '1Ng35Wh0zOIu1Upct0ytW9R2vWKSozxtW';
        const response = await uploadToDrive(file, parentId);
        if (response) {
            await CVTemplate.create({
                name,
                url,
                fileId: response.data.id,
                fileUrl: `https://drive.google.com/file/d/${response.data.id}/view`,
                propoties
            })
            return { status: 200, data: { message: messages.file.FILE_UPLOAD_ACCESS } };
        }
        return { status: 400, data: { message: messages.file.UPLOAD_FAILED } };
    } catch (error) {
        console.log(error);
        return { status: 500, data: { message: messages.error.ERR_INTERNAL } };
    }
};

const getDataDashBorad = async () => {
    try {
        const data = {
            user: await User.count(),
            candidate: await User.count({
                include: [{
                    model: Role,
                    where: { name: 'candidate' },
                }]
            }),
            recruiter: await User.count({
                include: [{
                    model: Role,
                    where: { name: 'recruiter' },
                }]
            }),
            recruitmentNews: await RecruitmentNews.count({
                where: { status: messages.recruitmentNews.status.APPROVED },
            }),
        }
        return { status: 200, data: data };
    } catch (error) {
        console.log(error);
        return { status: 500, data: { message: messages.error.ERR_INTERNAL } };
    }
}

export default { getAllUsers, deleteAUser, getRequest, approveRecruitment, uploadCvTemplate, getDataDashBorad };