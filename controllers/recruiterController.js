import recruiterService from "../services/recruiterService.js";
import messages from "../config/message.js";

export const postRecruitmentNews = async (req, res) => {
    try {
        const result = await recruiterService.postRecruitmentNews(req.body, req.user.id);
        return res.status(result.status).json(result.data);
    } catch (err) {
        console.error(err);
        res.status(500).send(messages.error.ERR_INTERNAL);
    }
};

export const getApplicant = async (req, res) => {
    try {
        const result = await recruiterService.getApplicant(req.user.id, req.params.id);
        return res.status(result.status).json(result.data);
    } catch (err) {
        console.error(err);
        res.status(500).send(messages.error.ERR_INTERNAL);
    }
};

export const approvedApplication = async (req, res) => {
    try {
        const {status} = req.body;
        const result = await recruiterService.approvedApplication(req.params.id, status, req.user.id);
        return res.status(result.status).json(result.data);
    } catch (err) {
        console.error(err);
        res.status(500).send(messages.error.ERR_INTERNAL);
    }
};

export const getNotification = async (req, res) => {
    try {
        const result = await recruiterService.getNotification(req.user.id);
        res.status(result.status).json(result.data);
    } catch (error) {
        res.status(500).json({ message: messages.error.ERR_INTERNAL });
    }
};

export const getPostedRecruitmentNews = async (req, res) => {
    try {
        const result = await recruiterService.getPostedRecruitmentNews(req.user.id);
        res.status(result.status).json(result.data);
    } catch (error) {
        res.status(500).json({ message: messages.error.ERR_INTERNAL });
    }
};

export const getDataDashBoard = async (req, res) => {
    try {
        const result = await recruiterService.getDataDashBoard(req.user.id);
        res.status(result.status).json(result.data);
    } catch (error) {
        res.status(500).json({ message: messages.error.ERR_INTERNAL });
    }
};

export const updateRecruitmentNews = async (req, res) => {
    try {
        const result = await recruiterService.updateRecruitmentNews(req.body, req.user.id, req.params.id);
        return res.status(result.status).json(result.data);
    } catch (err) {
        console.error(err);
        res.status(500).send(messages.error.ERR_INTERNAL);
    }
};

export const deleteRecruitmentNews = async (req, res) => {
    try {
        const result = await recruiterService.deleteRecruitmentNews(req.params.id, req.user.id);
        return res.status(result.status).json(result.data);
    } catch (err) {
        console.error(err);
        res.status(500).send(messages.error.ERR_INTERNAL);
    }
};