
import userService from '../services/userService.js';
import messages from '../config/message.js';

export const registerCandidate = async (req, res) => {
    try {
        const result = await userService.registerUser(req.body, "candidate");
        res.status(result.status).json(result.data);
    } catch (error) {
        console.error("Lỗi đăng ký ứng viên (controller):", error);
        res.status(500).json({ message: messages.error.ERR_INTERNAL });
    }
};

export const registerRecruiter = async (req, res) => {
    try {
        const result = await userService.registerUser(req.body, "recruiter");
        res.status(result.status).json(result.data);
    } catch (error) {
        console.error("Lỗi đăng ký nhà tuyển dụng (controller):", error);
        res.status(500).json({ message: messages.error.ERR_INTERNAL });
    }
};

export const getProfile = async (req, res) => {
    try {
        const result = await userService.getUserProfile(req.user.id);
        res.status(result.status).json(result.data);
    } catch (error) {
        console.error("Lỗi lấy thông tin người dùng (controller):", error);
        res.status(500).json({ message: messages.error.ERR_INTERNAL });
    }
};


export const changePassword = async (req, res) => {
    try {
        const result = await userService.changePassword(req.user.id, req.body);
        res.status(result.status).json(result.data);
    } catch (error) {
        res.status(500).json({ message: messages.error.ERR_INTERNAL });
    }
};


export const changeProfile = async (req, res) => {
    try {
        const result = await userService.changeProfile(req.user.id, req.body);
        res.status(result.status).json(result.data);
    } catch (error) {
        res.status(500).json({ message: messages.error.ERR_INTERNAL });
    }
};

export const applyJob = async (req, res) => {
    try {
        const result = await userService.applyJob(req.user.id, req.params.id, req.file);
        res.status(result.status).json(result.data);
    } catch (error) {
        res.status(500).json({ message: messages.error.ERR_INTERNAL });
    }
};

export const getInfoCompany = async (req, res) => {
    try {
        const result = await userService.getInfoCompany(req.params.id);
        res.status(result.status).json(result.data);
    } catch (error) {
        res.status(500).json({ message: messages.error.ERR_INTERNAL });
    }
};

export const getAllCompany = async (req, res) => {
    try {
        const result = await userService.getAllCompany();
        res.status(result.status).json(result.data);
    } catch (error) {
        res.status(500).json({ message: messages.error.ERR_INTERNAL });
    }
};

export const getNotification = async (req, res) => {
    try {
        const result = await userService.getNotification(req.user.id);
        res.status(result.status).json(result.data);
    } catch (error) {
        res.status(500).json({ message: messages.error.ERR_INTERNAL });
    }
};

export const getTemplateCV = async (req, res) => {
    try {
        const result = await userService.getTemplateCV();
        res.status(result.status).json(result.data);
    } catch (error) {
        res.status(500).json({ message: messages.error.ERR_INTERNAL });
    }
};

export const getDetailTemplateCV = async (req, res) => {
    try {
        const result = await userService.getDetailTemplateCV(req.params.id);
        res.status(result.status).json(result.data);
    } catch (error) {
        res.status(500).json({ message: messages.error.ERR_INTERNAL });
    }
};

export const getInfoApplication = async (req, res) => {
    try {
        const result = await userService.getInfoApplication(req.user.id);
        res.status(result.status).json(result.data);
    } catch (error) {
        res.status(500).json({ message: messages.error.ERR_INTERNAL });
    }
};