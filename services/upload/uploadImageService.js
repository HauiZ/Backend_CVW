import drive from "../../config/googleDrive/driveconfig.js";
import CvFiles from "../../models/CvFiles.js";
import PersonalUser from "../../models/PersonalUser.js";
import CompanyUser from "../../models/CompanyUser.js";
import stream from 'stream';
import sequelize from '../../config/database.js';
import messages from "../../config/message.js";
import uploadToDrive from "../../helper/uploadFile.js";

const uploadAvatar = async (file, userId) => {
    try {
        if (!file) return { status: 400, data: { message: messages.file.ERR_FILE_NOT_EXISTS } };
        const parentId = '19AjBrcQijc9wf9BYWxJWzjxDL9PDa6uJ';
        const response = await uploadToDrive(file, parentId);
        if (response) {
            const personal = await PersonalUser.findOne({
                where: { userId: userId },
            })
            await personal.update({ avatarId: response.data.id, avatarUrl: `https://drive.google.com/file/d/${response.data.id}/view` });
            return {
                status: 200, data: {
                    message: messages.file.FILE_UPLOAD_ACCESS,
                    link: `https://drive.google.com/file/d/${response.data.id}/view`,
                    downloadLink: `https://drive.google.com/uc?export=download&id=${response.data.id}`
                }
            };
        }
        return { status: 400, data: { message: messages.file.UPLOAD_FAILED } };
    } catch (error) {
        console.log(error);
        return { status: 500, data: { message: messages.error.ERR_INTERNAL } };
    }
};

const uploadLogoBussiness = async (file, userId) => {
    try {
        if (!file) return { status: 400, data: { message: messages.file.ERR_FILE_NOT_EXISTS } };
        const parentId = '1LfaAnb5VKpK7SJyS2t0ShdADd1t7edp4';
        const response = await uploadToDrive(file, parentId);
        if (response) {
            const company = await CompanyUser.findOne({
                where: { userId: userId },
            })
            await company.update({ logoId: response.data.id, logoUrl: `https://drive.google.com/file/d/${response.data.id}/view` });
            return {
                status: 200, data: {
                    message: messages.file.FILE_UPLOAD_ACCESS,
                    link: `https://drive.google.com/file/d/${response.data.id}/view`,
                    downloadLink: `https://drive.google.com/uc?export=download&id=${response.data.id}`
                }
            };
        }
        return { status: 400, data: { message: messages.file.UPLOAD_FAILED } };
    } catch (error) {
        console.log(error);
        return { status: 500, data: { message: messages.error.ERR_INTERNAL } };
    }
};
export default { uploadAvatar, uploadLogoBussiness };
