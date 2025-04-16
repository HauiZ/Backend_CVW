import drive from "../../config/googleDrive/driveconfig.js";
import CvFiles from "../../models/CvFiles.js";
import PersonalUser from "../../models/PersonalUser.js";
import CompanyUser from "../../models/CompanyUser.js";
import stream from 'stream';
import sequelize from '../../config/database.js';
import messages from "../../config/message.js";

const uploadAvatar = async (file, userId) => {
    const transaction = await sequelize.transaction();
    try {
        if (!file) return { status: 400, data: { message: messages.file.ERR_FILE_NOT_EXISTS } };

        const fileMetadata = {
            name: file.originalname,
            mimeType: file.mimetype,
            parents: ['19AjBrcQijc9wf9BYWxJWzjxDL9PDa6uJ']
        };

        const bufferStream = new stream.PassThrough();
        bufferStream.end(file.buffer);

        const response = await drive.files.create({
            resource: fileMetadata,
            media: {
                mimeType: file.mimetype,
                body: bufferStream,
            },
            fields: 'id,webViewLink',
        }, { transaction });

        await drive.permissions.create({
            fileId: response.data.id,
            requestBody: {
                role: 'reader',
                type: 'anyone',
            },
        }, { transaction });
        const personal = await PersonalUser.findOne({
            where: {userId: userId},
        })
        await personal.update({avatarId: response.data.id, avatarUrl: `https://drive.google.com/file/d/${response.data.id}/view`});
        await transaction.commit();
        return {
            status: 200, data: {
                message: messages.file.FILE_UPLOAD_ACCESS,
                link: `https://drive.google.com/file/d/${response.data.id}/view`,
                downloadLink: `https://drive.google.com/uc?export=download&id=${response.data.id}`
            }
        };
    } catch (error) {
        console.log(error);
        if (!transaction.finished) {
            await transaction.rollback();
        }
        return { status: 500, data: { message: messages.error.ERR_INTERNAL} };
    }
};

const uploadLogoBussiness = async (file, userId) => {
    const transaction = await sequelize.transaction();
    try {
        if (!file) return { status: 400, data: { message: messages.file.ERR_FILE_NOT_EXISTS } };

        const fileMetadata = {
            name: file.originalname,
            mimeType: file.mimetype,
            parents: ['1LfaAnb5VKpK7SJyS2t0ShdADd1t7edp4']
        };

        const bufferStream = new stream.PassThrough();
        bufferStream.end(file.buffer);

        const response = await drive.files.create({
            resource: fileMetadata,
            media: {
                mimeType: file.mimetype,
                body: bufferStream,
            },
            fields: 'id,webViewLink',
        }, { transaction });

        await drive.permissions.create({
            fileId: response.data.id,
            requestBody: {
                role: 'reader',
                type: 'anyone',
            },
        }, { transaction });
        const company = await CompanyUser.findOne({
            where: {userId: userId},
        })
        await company.update({logoId: response.data.id, logoUrl: `https://drive.google.com/file/d/${response.data.id}/view`});
        await transaction.commit();
        return {
            status: 200, data: {
                message: messages.file.FILE_UPLOAD_ACCESS,
                link: `https://drive.google.com/file/d/${response.data.id}/view`,
                downloadLink: `https://drive.google.com/uc?export=download&id=${response.data.id}`
            }
        };
    } catch (error) {
        console.log(error);
        if (!transaction.finished) {
            await transaction.rollback();
        }
        return { status: 500, data: { message: messages.error.ERR_INTERNAL } };
    }
};
export default { uploadAvatar, uploadLogoBussiness };
