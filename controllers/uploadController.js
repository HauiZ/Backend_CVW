import uploadCvService from "../services/upload/uploadCvService.js";
import uploadImageService from "../services/upload/uploadImageService.js";
import messages from "../config/message.js";

export const uploadCV = async (req, res) => {
    try {
        const result = await uploadCvService.uploadCV(req.file, req.user.id);
        res.status(result.status).json(result.data);
    } catch (error) {
        res.status(500).json({ message: messages.error.ERR_INTERNAL });
    }
};

export const uploadAvatar = async (req, res) => {
    try {
        const result = await uploadImageService.uploadAvatar(req.file, req.user.id);
        res.status(result.status).json(result.data);
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: messages.error.ERR_INTERNAL });
    }
};

export const uploadLogoBusiness = async (req, res) => {
    try {
        const result = await uploadImageService.uploadLogoBusiness(req.file, req.user.id);
        res.status(result.status).json(result.data);
    } catch (error) {
        res.status(500).json({ message: messages.error.ERR_INTERNAL });
    }
};