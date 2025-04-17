import drive from "../../config/googleDrive/driveconfig.js";
import CvFiles from "../../models/CvFiles.js";
import stream from 'stream';
import sequelize from '../../config/database.js';
import messages from "../../config/message.js";
import uploadToDrive from "../../helper/uploadFile.js";

const uploadCV = async (file, userId) => {
    try {
        if (!file) return { status: 400, data: { message: messages.file.ERR_FILE_NOT_EXISTS } };

        const parentId = '1JzXkyJPkZKbLEfOEGjS1mwZZBoP7qxO7';
        const response = await uploadToDrive(file, parentId);
        if (response) {
            const fileData = await CvFiles.create({
                personalId: userId,
                filename: file.originalname,
                fileId: response.data.id,
                urlView: `https://drive.google.com/file/d/${response.data.id}/view`,
                urlDowload: `https://drive.google.com/uc?export=download&id=${response.data.id}`,

            });

            return {
                status: 200, data: {
                    message: messages.file.FILE_UPLOAD_ACCESS,
                    cvId: fileData.id,
                    link: fileData.urlView,
                    downloadLink: fileData.urlDowload,
                }
            };
        }
        return { status: 400, data: { message: messages.file.UPLOAD_FAILED } };

    } catch (error) {
        console.log(error);
        return { status: 500, data: { message: messages.error.ERR_INTERNAL } };
    }
};

export default { uploadCV };
