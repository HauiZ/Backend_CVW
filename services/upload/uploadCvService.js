import drive from "../../config/googleDrive/driveconfig.js";
import CvFiles from "../../models/CvFiles.js";
import stream from 'stream';
import sequelize from '../../config/database.js';
import messages from "../../config/message.js";

const uploadCV = async (file, userId) => {
    const transaction = await sequelize.transaction();
    try {
        if (!file) return { status: 400, data: { message: messages.file.ERR_FILE_NOT_EXISTS } };

        const fileMetadata = {
            name: file.originalname,
            mimeType: file.mimetype,
            parents: ['1JzXkyJPkZKbLEfOEGjS1mwZZBoP7qxO7']
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

        const fileData = await CvFiles.create({
            personalId: userId,
            filename: file.originalname,
            fileId: response.data.id,
        }, { transaction });

        await transaction.commit();

        return {
            status: 200, data: {
                message: messages.file.FILE_UPLOAD_ACCESS,
                file: fileData,
                link: `https://drive.google.com/file/d/${response.data.id}/view`,
                downloadLink: `https://drive.google.com/uc?export=download&id=${response.data.id}`
            }
        };
    } catch (error) {
        console.log(error);
        if (!transaction.finished) {
            await transaction.rollback();
        }
        return { status: 500, data: { message: messages.error.ERR_INTERNAL, error } };
    }
};

export default { uploadCV };
