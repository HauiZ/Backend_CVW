import recruitmentNewsService from '../services/recruitmentNewsService.js';
import messages from '../config/message.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const getRecruitmentNews = async (req, res) => {
    try {
        const result = await recruitmentNewsService.getAllRecruitmentNews();
        return res.status(result.status).json(result.data);
    } catch (err) {
        console.error(err);
        res.status(500).send(messages.error.ERR_INTERNAL);
    }
};

export const filterRecruitmentNews = async (req, res) => {
    try {
        let user_id = null;
        const token = req.header("Authorization");
        if (token) {
            try {
                const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
                user_id = decoded.id;
            } catch (error) {
                console.error('JWT verification error:', error.message);
            }
        }
        const filterData = req.query;
        const result = await recruitmentNewsService.filterAllRecruitmentNews(filterData, user_id);
        return res.status(result.status).json(result.data);
    } catch (err) {
        console.error(err);
        res.status(500).send(messages.error.ERR_INTERNAL);
    }
};

export const getDetailRecruitmentNews = async (req, res) => {
    try {
        const result = await recruitmentNewsService.getDetailRecruitmentNews(req.params.id, req.user.id);
        res.status(result.status).json(result.data);
    } catch (err) {
        res.status(500).json({ message: messages.error.ERR_INTERNAL });
    }
};
