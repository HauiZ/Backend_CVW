import stream from 'stream';
import sequelize from '../config/database.js';
import drive from "../config/googleDrive/driveconfig.js";

export const uploadToDrive = async (file, parentId) => {
    try {
        const fileMetadata = {
            name: file.originalname,
            mimeType: file.mimetype,
            parents: [parentId]
        };

        const bufferStream = new stream.PassThrough(); // 	tạo stream trung gian
        bufferStream.end(file.buffer); // đẩy buffer(raw binary) vào stream

        const response = await drive.files.create({
            resource: fileMetadata,
            media: {
                mimeType: file.mimetype,
                body: bufferStream,
            },
            fields: 'id,webViewLink', // liên kết xem file trên trình duyệt
        });

        await drive.permissions.create({
            fileId: response.data.id,
            requestBody: {
                role: 'reader',
                type: 'anyone',
            },
        });
        return response;
    } catch (error) {
        console.log(error);
        return null;
    }
}

export default uploadToDrive;