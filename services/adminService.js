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

const getRequest = async () => {
    try {
        const requests = await Request.findAll();
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
        const recruitmentNew = await RecruitmentNews.findByPk(recruitmentNewId);
        await recruitmentNew.update({ status: status });
        await request.destroy();
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
        return { status: 200, data: { message: messages.file.UPLOAD_FAILED } };
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