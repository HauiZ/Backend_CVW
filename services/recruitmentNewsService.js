import RecruitmentNews from "../models/RecruitmentNews.js";
import sequelize from '../config/database.js';
import Area from '../models/Area.js';
import { Op } from 'sequelize';
const getAllRecruitmentNews = async () => {
    try {
        const jobs = await RecruitmentNews.findAll();
        return { status: 200, data: jobs }
    } catch (err) {
        return { status: 500, data: { message: "Lỗi lấy danh sách job (service):", err } };
    }
}

const filterAllRecruitmentNews = async (FilterData) => {
    try {
        const { keyword, jobTitle, area,  experience, jobLevel, salaryMin, salaryMax, workType, sortBy, order } = FilterData;
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

        return {status: 200, data: jobs};
    } catch (err) {
        return { status: 500, data: { message: "Lỗi lấy danh sách job (service):", err } };
    }
}

export default {getAllRecruitmentNews, filterAllRecruitmentNews};