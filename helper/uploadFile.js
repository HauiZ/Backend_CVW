import stream from 'stream';
import sequelize from '../config/database.js';
import drive from "../config/googleDrive/driveconfig.js";

export const uploadToDrive = async (file, parentId) => {
    const transaction = await sequelize.transaction();
    try {
        const fileMetadata = {
            name: file.originalname,
            mimeType: file.mimetype,
            parents: [parentId]
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
        await transaction.commit();
        return response;
    } catch (error) {
        console.log(error);
        if (!transaction.finished) {
            await transaction.rollback();
        }
        return null;
    }
}

export default uploadToDrive;