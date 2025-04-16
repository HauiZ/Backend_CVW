import recruiterService from "../services/recruiterService.js";

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
        const result = await recruiterService.getApplicant(req.user.id);
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

