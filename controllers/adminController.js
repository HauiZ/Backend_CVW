import adminService from "../services/adminService.js";
import messages from "../config/message.js";

export const getUsers = async (req, res) => {
    try {
        const result = await adminService.getAllUsers(req.user.id, req.query);
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
        res.status(500).json({ message: messages.error.ERR_INTERNAL});
    }
}

export const getRequest = async (req, res) => {
    try {
        const result = await adminService.getRequest(req.query);
        res.status(result.status).json(result.data);
    } catch (error) {
        res.status(500).json({ message: messages.error.ERR_INTERNAL });
    }
};

export const approveRecruitment = async (req, res) => {
    try {
        const {status} = req.body;
        const result = await adminService.approveRecruitment(req.params.id, status);
        res.status(result.status).json(result.data);
    } catch (error) {
        res.status(500).json({ message: messages.error.ERR_INTERNAL});
    }
};

export const uploadCvTemplate = async (req, res) => {
    try {
        const result = await adminService.uploadCvTemplate(req.body, req.file);
        res.status(result.status).json(result.data);
    } catch (error) {
        res.status(500).json({ message: messages.error.ERR_INTERNAL });
    }
};

export const getDataDashBoard = async (req, res) => {
    try {
        const result = await adminService.getDataDashBoard();
        res.status(result.status).json(result.data);
    } catch (error) {
        res.status(500).json({ message: messages.error.ERR_INTERNAL });
    }
};