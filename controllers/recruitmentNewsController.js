import recruitmentNewsService from '../services/recruitmentNewsService.js';


export const getRecruitmentNews = async (req, res) => {
    try {
        const result = await recruitmentNewsService.getAllRecruitmentNews();
        return res.status(result.status).json(result.data);
    } catch (err) {
        console.error("DB error:", err);
        res.status(500).send("Lỗi server");
    }
};

export const filterRecruitmentNews = async (req, res) => {
    try {
        const filterData = req.query;
        const result = await recruitmentNewsService.filterAllRecruitmentNews(filterData);
        return res.status(result.status).json(result.data);
    } catch (err) {
        console.error("DB error:", err);
        res.status(500).send("Lỗi server");
    }
};
