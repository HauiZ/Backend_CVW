import adminService from "../services/adminService.js";
import messages from "../config/message.js";

export const getUsers = async (req, res) => {
    try {
        const result = await adminService.getAllUsers();
        res.status(result.status).json(result.data);
    } catch (error) {
        console.error("Lỗi lấy danh sách người dùng (controller):", error);
        res.status(500).json({ message: messages.error.ERR_INTERNAL });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const result = await adminService.deleteAUser(req.params.id);
        res.status(result.status).json(result.data);
    } catch (err) {
        res.status(500).json({ message: messages.error.ERR_INTERNAL, err});
    }
}

export const getRequest = async (req, res) => {
    try {
        const result = await adminService.getRequest();
        res.status(result.status).json(result.data);
    } catch (error) {
        res.status(500).json({ message: messages.error.ERR_INTERNAL });
    }
};

export const getRecruitmentNews = async (req, res) => {
    try {
        const result = await adminService.getRecruitmentNews(req.params.id);
        res.status(result.status).json(result.data);
    } catch (err) {
        res.status(500).json({ message: messages.error.ERR_INTERNAL, err});
    }
};

export const approveRecruitment = async (req, res) => {
    try {
        const {status} = req.body;
        const result = await adminService.approveRecruitment(req.params.id, status);
        res.status(result.status).json(result.data);
    } catch (error) {
        res.status(500).json({ message: messages.error.ERR_INTERNAL, err});
    }
};