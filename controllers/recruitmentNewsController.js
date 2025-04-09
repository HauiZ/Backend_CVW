import sequelize from '../config/database.js';
import Area from '../models/Area.js';
import RecruitmentNews from "../models/RecruitmentNews.js";
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
        const { keyword, jobTitle, area,  experience, jobLevel, salaryMin, salaryMax, workType, sortBy, order } = req.query;
        const whereCondition = {};
        const orderCondition = [];
        const includeOptions = [];
        if (keyword) {
            whereCondition[Op.or] = [
                { jobTitle: { [Op.iLike]: `%${keyword}%` } },
                { profession: { [Op.iLike]: `%${keyword}%` } },
                { '$CompanyUser.name$': { [Op.iLike]: `%${keyword}%` } }, 
            ];

            includeOptions.push({
                model: CompanyUser,
                as: 'CompanyUser', 
                attributes: [], 
                where: { name: { [Op.like]: `%${keyword}%` } }
            });
        } else {
            includeOptions.push({
                model: CompanyUser,
                as: 'CompanyUser',
                attributes: ['name'],
            });
        }

        if (area) {
            whereCondition[Op.and] = [
                { '$Area.province$': { [Op.eq]: `%${area}%`}}
            ];

            includeOptions.push({
                model: Area,
                as: 'Area',
                attributes: [],
                where: { province: { [Op.eq]: `%${area}%`} }
            });
        } else {
            includeOptions.push({
                model: Area,
                as: 'Area',
                attributes: ['province'],
            });
        }

        if (jobTitle) {
            whereCondition.jobTitle = Array.isArray(jobTitle) ? { [Op.in]: jobTitle } : { [Op.like]: `%${jobTitle}%` };
        }

        if (jobLevel) {
            whereCondition.jobLevel = jobLevel;
        }

        if (salaryMin || salaryMax) {
            whereCondition[Op.and] = [];
            const minSalary = salaryMin ? parseInt(salaryMin) : null;
            const maxSalary = salaryMax ? parseInt(salaryMax) : null;

            if (minSalary) {
                whereCondition[Op.and].push(sequelize.literal(`CAST(SUBSTRING_INDEX(salaryRange, '-', 1) AS UNSIGNED) >= ${minSalary}`));
            }
            if (maxSalary) {
                whereCondition[Op.and].push(sequelize.literal(`CAST(SUBSTRING_INDEX(salaryRange, '-', -1) AS UNSIGNED) <= ${maxSalary}`));
            }
            if (whereCondition[Op.and].length === 0) delete whereCondition[Op.and];
        }

        if (experience) {
            whereCondition.experience = experience;
        }

        if (workType) {
            whereCondition.workType = workType;
        }

        const validSortFields = ['experience', 'salary', 'datePosted'];
        const orderBy = sortBy && validSortFields.includes(sortBy) ? sortBy : 'datePosted';
        const orderDirection = order === 'ASC' ? 'ASC' : 'DESC';

        if (orderBy === 'salary') {
            orderCondition.push([sequelize.literal(`CAST(SUBSTRING_INDEX(salaryRange, '-', -1) AS UNSIGNED)`), orderDirection]);
        } else {
            orderCondition.push([orderBy, orderDirection]);
        }

        const jobs = await RecruitmentNews.findAll({
            where: whereCondition,
            order: orderCondition,
            include: includeOptions
        });

        res.status(200).json(jobs);
    } catch (err) {
        console.error("DB error:", err);
        res.status(500).send("Lỗi server");
    }
};
