import RecruitmentNews from "../models/RecruitmentNews.js";
import CompanyUser from "../models/CompanyUser.js";
import sequelize from '../config/database.js';
import Area from '../models/Area.js';
import { Op } from 'sequelize';
import messages from "../config/message.js";
import Request from "../models/Request.js";
import moment from 'moment-timezone';
const getAllRecruitmentNews = async () => {
    try {
        const listJob = await RecruitmentNews.findAll({
            where: { status: messages.recruitmentNews.status.APPROVED },
            attributes: ['id', 'companyId', 'jobTitle', 'profession', 'salaryMin', 'salaryMax', 'datePosted'],
        });
        const jobs = await Promise.all(listJob.map(async job => {
            const company = await CompanyUser.findByPk(job.companyId, {
                attributes: ['name', 'logoUrl'],
                include: {
                    model: Area,
                    attributes: ['province'],
                }
            });
            const data = job.toJSON();
            return {
                ...data,
                companyName: company.name,
                logoUrl: company.logoUrl,
                companyAddress: company.Area.province,
                datePosted: moment(data.datePosted).format('YYYY-MM-DD HH:mm:ss')
            };
        }));
        return { status: 200, data: jobs };
    } catch (err) {
        console.log(err);
        return { status: 500, data: { message: messages.error.ERR_INTERNAL } };
    }
}

const filterAllRecruitmentNews = async (filterData) => {
    try {
        const { keyword, profession, area, experience, jobLevel, salaryMin, salaryMax, workType, sortBy, order } = filterData;
        const whereCondition = {};
        const orderCondition = [];
        const includeOptions = [];

        if (keyword) {
            whereCondition[Op.or] = [
                { jobTitle: { [Op.like]: `%${keyword}%` } },
                { profession: { [Op.like]: `%${keyword}%` } },
                { '$CompanyUser.name$': { [Op.like]: `%${keyword}%` } },
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
            whereCondition['$Area.province$'] = { [Op.like]: `%${area}%` };
            includeOptions.push({
                model: Area,
                as: 'Area',
                attributes: [],
                where: { province: { [Op.like]: `%${area}%` } }
            });
        } else {
            includeOptions.push({
                model: Area,
                as: 'Area',
                attributes: ['province'],
            });
        }

        if (profession) {
            whereCondition.profession = Array.isArray(profession) ? { [Op.in]: profession } : { [Op.like]: `%${profession}%` };
        }

        if (jobLevel) {
            whereCondition.jobLevel = jobLevel;
        }

        if (salaryMin !== undefined && salaryMin !== null) {
            whereCondition.salaryMin = { [Op.gte]: parseInt(salaryMin) };
        }
        if (salaryMax !== undefined && salaryMax !== null) {
            whereCondition.salaryMax = { [Op.lte]: parseInt(salaryMax) };
        }
        if ((salaryMin !== undefined && salaryMin !== null) && (salaryMax !== undefined && salaryMax !== null)) {
            if (!whereCondition[Op.and]) {
                whereCondition[Op.and] = [];
            }
            whereCondition[Op.and].push({ salaryMin: { [Op.gte]: parseInt(salaryMin) } });
            whereCondition[Op.and].push({ salaryMax: { [Op.lte]: parseInt(salaryMax) } });
            delete whereCondition.salaryMin;
            delete whereCondition.salaryMax;
        }

        if (experience) {
            whereCondition.experience = experience;
        }

        if (workType) {
            whereCondition.workType = workType;
        }

        const validSortFields = ['experience', 'salaryMin', 'salaryMax', 'datePosted'];
        const orderBy = sortBy && validSortFields.includes(sortBy) ? sortBy : 'datePosted';
        const orderDirection = order === 'ASC' ? 'ASC' : 'DESC';

        orderCondition.push([orderBy, orderDirection]);

        const jobs = await RecruitmentNews.findAll({
            where: whereCondition,
            order: orderCondition,
            include: includeOptions,
            attributes: ['id', 'companyId', 'jobTitle', 'profession', 'salaryMin', 'salaryMax', 'datePosted'],
        });
        const data = await Promise.all(jobs.map(async job => {
            const company = await CompanyUser.findByPk(job.companyId, {
                attributes: ['name', 'logoUrl'],
                include: {
                    model: Area,
                    attributes: ['province'],
                }
            });
            const data = job.toJSON();
            return {
                id: data.id,
                companyId: data.companyId,
                jobTitle: data.jobTitle,
                profession: data.profession,
                salaryMin: data.salaryMin,
                salaryMax: data.salaryMax,
                companyName: company.name,
                logoUrl: company.logoUrl,
                companyAddress: company.Area.province,
                datePosted: moment(data.datePosted).format('YYYY-MM-DD HH:mm:ss')
            };
        }));
        return { status: 200, data: data };
    } catch (err) {
        console.log(err);
        return { status: 500, data: { message: messages.error.ERR_INTERNAL } };
    }
};

const getDetailRecruitmentNews = async (recruitmentNewId) => {
    try {
        const recruitmentNew = await RecruitmentNews.findByPk(recruitmentNewId, {
            include: [{
                model: Area,
                attributes: ['province'],
            }, {
                model: CompanyUser,
                attributes: ['userId', 'name', 'field', 'companySize', 'companyAddress', 'logoUrl'],
            }]
        });
        const data = recruitmentNew.toJSON();
        const job = {
            general: {
                jobLevel: data.jobLevel,
                candidateNumber: data.candidateNumber,
                workType: data.workType
            },
            introduce: {
                jobTitle: data.jobTitle,
                salaryRange: `${data.salaryMin}-${data.salaryMax}`,
                address: data.Area.province,
                experience: data.experience,
                applicationDeadline: moment(data.applicationDeadline).format('YYYY-MM-DD HH:mm:ss')
            },
            detailRecruitment: {
                profession: data.profession,
                jobRequirements: data.jobRequirements,
                workDetail: data.workDetail,
                benefits: data.benefits,
                degree: data.degree,
                jobAddress: data.jobAddress,
                salaryNegotiable: data.salaryNegotiable,
                workDateIn: moment(data.workDateIn).format('YYYY-MM-DD HH:mm:ss'),
                contactInfo: data.contactInfo,
                contactAddress: data.contactAddress,
                contactPhone: data.contactPhone,
                contactEmail: data.contactEmail,
                videoUrl: data.videoUrl,
                datePosted: moment(data.datePosted).format('YYYY-MM-DD HH:mm:ss'),
            },
            company: {
                id: data.CompanyUser.userId,
                companyName: data.CompanyUser.name,
                companyLogo: data.CompanyUser.logoUrl,
                field: data.CompanyUser.field,
                companySize: data.CompanyUser.companySize,
                companyAddress: data.CompanyUser.companyAddress
            }
        }

        return { status: 200, data: job };
    } catch (error) {
        console.log(error);
        return { status: 500, data: { message: messages.error.ERR_INTERNAL } };
    }
}
export default { getAllRecruitmentNews, filterAllRecruitmentNews, getDetailRecruitmentNews };