
import PersonalUser from "../../models/PersonalUser.js";
import CompanyUser from "../../models/CompanyUser.js";
import messages from "../../config/message.js";
import cloudinary from '../../config/cloudinary.js';

const uploadImageAndUpdate = async (file, userId, Model, updateFields) => {
    try {
        if (!file) return { status: 400, data: { message: messages.file.ERR_FILE_NOT_EXISTS } };

        const public_id = file.filename || file.public_id; // id của file trên cloudinary
        const secure_url = file.path || file.secure_url; // đường dẫn truy cập file trên cloudinary
        if (!public_id || !secure_url) {
            return { status: 400, data: { message: messages.file.UPLOAD_FAILED } };
        }
        const user = await Model.findOne({ where: { userId } });

        if (!user) {
            return { status: 404, data: { message: messages.user.NOT_FOUND } };
        }
        // Xóa ảnh cũ nếu có
        if (user.logoId && user.logoId !== undefined && user.logoId !== null) {
            await cloudinary.uploader.destroy(user.logoId);
        }

        if (user.avatarId && user.avatarId !== undefined && user.avatarId !== null) {
            await cloudinary.uploader.destroy(user.avatarId);
        }

        await user.update({
            [updateFields.id]: public_id,
            [updateFields.url]: secure_url,
        });

        return {
            status: 200,
            data: {
                message: messages.file.FILE_UPLOAD_ACCESS,
                link: secure_url,
            },
        };
    } catch (error) {
        console.log(error)
        return { status: 500, data: { message: messages.error.ERR_INTERNAL } };
    }

};

const uploadAvatar = (file, userId) => uploadImageAndUpdate(file, userId, PersonalUser, { id: 'avatarId', url: 'avatarUrl' });
const uploadLogoBusiness = (file, userId) => uploadImageAndUpdate(file, userId, CompanyUser, { id: 'logoId', url: 'logoUrl' });

export default { uploadAvatar, uploadLogoBusiness };
