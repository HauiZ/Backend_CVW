import adminService from "../services/adminService.js";
import messages from "../config/message.js";

export const getUsers = async (req, res) => {
    try {
        const result = await adminService.getAllUsers(req.user.id, req.query);
        res.status(result.status).json(result.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: messages.error.ERR_INTERNAL });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const result = await adminService.deleteAUser(req.params.id);
        res.status(result.status).json(result.data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: messages.error.ERR_INTERNAL });
    }
}

export const getRequest = async (req, res) => {
    try {
        const result = await adminService.getRequest();
        res.status(result.status).json(result.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: messages.error.ERR_INTERNAL });
    }
};

export const approveRecruitment = async (req, res) => {
    try {
        const {status} = req.body;
        const result = await adminService.approveRecruitment(req.params.id, status);
        res.status(result.status).json(result.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: messages.error.ERR_INTERNAL });
    }
};

export const uploadCvTemplate = async (req, res) => {
    try {
        const result = await adminService.uploadCvTemplate(req.body, req.files);
        res.status(result.status).json(result.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: messages.error.ERR_INTERNAL });
    }
};

export const getDataDashBoard = async (req, res) => {
    try {
        const result = await adminService.getDataDashBoard();
        res.status(result.status).json(result.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: messages.error.ERR_INTERNAL });
    }
};

export const getTemplateCV = async (req, res) => {
    try {
        const result = await adminService.getTemplateCV();
        res.status(result.status).json(result.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: messages.error.ERR_INTERNAL });
    }
};

export const deleteTemplate = async (req, res) => {
    try {
        const result = await adminService.deleteTemplate(req.params.id);
        res.status(result.status).json(result.data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: messages.error.ERR_INTERNAL });
    }
}

export const updateCvTemplate = async (req, res) => {
    try {
        const result = await adminService.updateCvTemplate(req.params.id, req.body, req.files);
        res.status(result.status).json(result.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: messages.error.ERR_INTERNAL });
    }
};