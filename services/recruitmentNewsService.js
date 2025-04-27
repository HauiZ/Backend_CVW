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
};

const filterAllRecruitmentNews = async (filterData) => {
    try {
        const { currentNewsId, keyword, profession, area, experience, jobLevel, salaryMin, salaryMax, workType, sortBy, order } = filterData;
        const whereCondition = {};
        const orderCondition = [];
        const includeOptions = [];

        whereCondition.status = messages.recruitmentNews.status.APPROVED;

        if (keyword && keyword.trim() !== '') {
            const searchTerm = `%${keyword.trim()}%`;
            whereCondition[Op.or] = [
                { jobTitle: { [Op.like]: searchTerm } },
                { profession: { [Op.like]: searchTerm } },
                { '$CompanyUser.name$': { [Op.like]: searchTerm } }
            ];
        }

        includeOptions.push({
            model: CompanyUser,
            as: 'CompanyUser',
            attributes: ['userId', 'name', 'logoUrl'],
        });

        if (area && area.trim() !== '') {
            const searchArea = `%${area.trim()}%`;
            includeOptions.push({
                model: Area,
                as: 'Area',
                attributes: ['id', 'province'],
                where: { province: { [Op.like]: searchArea } },
            });
        } else {
            includeOptions.push({
                model: Area,
                as: 'Area',
                attributes: ['id', 'province'],
            });
        }

        if (profession) {
            if (Array.isArray(profession) && profession.length > 0) {
                whereCondition.profession = { [Op.in]: profession };
            } else if (typeof profession === 'string' && profession.trim() !== '') {
                whereCondition.profession = { [Op.like]: `%${profession.trim()}%` };
            }
        }

        if (jobLevel) {
            whereCondition.jobLevel = jobLevel;
        }

        if (salaryMin !== undefined && salaryMin !== null && salaryMax !== undefined && salaryMax !== null) {
            whereCondition[Op.and] = whereCondition[Op.and] || [];
            whereCondition[Op.and].push(
                { salaryMin: { [Op.gte]: parseInt(salaryMin) } },
                { salaryMax: { [Op.lte]: parseInt(salaryMax) } }
            );
        } else {
            if (salaryMin !== undefined && salaryMin !== null) {
                whereCondition.salaryMin = { [Op.gte]: parseInt(salaryMin) };
            }
            if (salaryMax !== undefined && salaryMax !== null) {
                whereCondition.salaryMax = { [Op.lte]: parseInt(salaryMax) };
            }
        }

        if (experience) {
            whereCondition.experience = experience;
        }

        if (workType) {
            whereCondition.workType = workType;
        }

        if (currentNewsId) {
            whereCondition.id = { [Op.ne]: currentNewsId };
        }

        const validSortFields = ['experience', 'salary', 'datePosted'];
        let orderBy;
        if (sortBy === 'salary') {
            orderBy = 'salaryMax';
        } else {
            orderBy = sortBy && validSortFields.includes(sortBy) ? sortBy : 'datePosted';
        }
        const orderDirection = order === 'ASC' ? 'ASC' : 'DESC';
        orderCondition.push([orderBy, orderDirection]);

        const jobs = await RecruitmentNews.findAll({
            where: whereCondition,
            order: orderCondition,
            include: includeOptions,
            attributes: ['id', 'companyId', 'jobTitle', 'profession', 'salaryMin', 'salaryMax', 'datePosted'],
            subQuery: false // Tắt subquery để tránh một số vấn đề với điều kiện phức tạp
        });

        const data = await Promise.all(jobs.map(async job => {
            let company = job.CompanyUser;
            if (!company) {
                company = await CompanyUser.findByPk(job.companyId, {
                    attributes: ['name', 'logoUrl'],
                    include: {
                        model: Area,
                        attributes: ['province'],
                    }
                });
            }

            return {
                id: job.id,
                companyId: job.companyId,
                jobTitle: job.jobTitle,
                profession: job.profession,
                salaryMin: job.salaryMin,
                salaryMax: job.salaryMax,
                companyName: company?.name || null,
                logoUrl: company?.logoUrl || null,
                companyAddress: job.Area?.province || company?.Area?.province || null,
                datePosted: moment(job.datePosted).format('YYYY-MM-DD HH:mm:ss')
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
};
export default { getAllRecruitmentNews, filterAllRecruitmentNews, getDetailRecruitmentNews };