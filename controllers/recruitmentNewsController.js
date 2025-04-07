import sequelize from'../config/database.js';
import RecruitmentNews from"../models/RecruitmentNews.js";
import { Op } from 'sequelize';
export const getRecruitmentNews = async (req, res) => {
    try {
        const jobs = await RecruitmentNews.findAll();
        res.json(jobs);
    } catch (err) {
        console.error("DB error:", err);
        res.status(500).send("Lỗi server");
    }
};

export const filterRecruitmentNews = async (req, res) => {
    try {
        const { category, salaryMin, salaryMax } = req.query;
        const whereCondition = {};

        if (category) {
            whereCondition.category = {
                [Op.like]: `%${category}%`
            };
        }
        if (salaryMin || salaryMax) {
            whereCondition.salary = {};
            if (salaryMin) whereCondition.salary[Op.gte] = parseInt(salaryMin);
            if (salaryMax) whereCondition.salary[Op.lte] = parseInt(salaryMax);
        }

        const jobs = await RecruitmentNews.findAll({ where: whereCondition });
        res.json(jobs);
    } catch (err) {
        console.error("DB error:", err);
        res.status(500).send("Lỗi server");
    }

};

export const sortRecruitmentNews = async (req, res) => {
    const { sortBy, order } = req.body;

    const validSortFields = ['experience', 'salary', 'datePosted'];
    if (sortBy && !validSortFields.includes(sortBy)) {
        return res.status(400).json({ message: `Tham số sortBy không hợp lệ. Các giá trị hợp lệ là: ${validSortFields.join(', ')}` });
    }

    const orderBy = sortBy || 'datePosted';
    const orderDirection = order === 'ASC' ? 'ASC' : 'DESC';

    try {
        const jobs = await RecruitmentNews.findAll({
            order: [[
                sortBy === 'salary' ? sequelize.literal(`CAST(SUBSTRING_INDEX(salaryRange, '-', -1) AS UNSIGNED)`) : orderBy,
                orderDirection]]
        });

        res.status(200).json(jobs);
    } catch (error) {
        res.status(500).json({ message: 'Có lỗi xảy ra!', error: error.message });
    }

};
