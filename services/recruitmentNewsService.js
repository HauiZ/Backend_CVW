import RecruitmentNews from "../models/RecruitmentNews.js";
import CompanyUser from "../models/CompanyUser.js";
import sequelize from '../config/database.js';
import Area from '../models/Area.js';
import { Op } from 'sequelize';
import messages from "../config/message.js";
import Request from "../models/Request.js";
import JobApplication from "../models/JobApplication.js";
import User from "../models/User.js";
import Role from "../models/Role.js";
import PersonalUser from "../models/PersonalUser.js";
import NewsMarks from "../models/NewsMarks.js";
import moment from 'moment-timezone';
import { getTimeLeft } from "../utils/getTimeLeft.js";
import { getRecommendations } from "../utils/getIdRecommendationModel.js";

const getAllRecruitmentNews = async (user_id, whereCondition = {}, orderCondition = [], includeOptions = []) => {
    try {
        const now = new Date();
        // Lấy jobs và recommendations song song
        const [listJob, recIds] = await Promise.all([
            // Query jobs
            RecruitmentNews.findAll({
                where: {
                    ...whereCondition,
                    status: messages.recruitmentNews.status.APPROVED,
                    // applicationDeadline: {
                    //     [Op.gte]: new Date() // Chỉ lấy job chưa hết hạn
                    // }
                },
                order: orderCondition,
                include: includeOptions,
                attributes: ['id', 'companyId', 'jobTitle', 'profession', 'salaryMin', 'salaryMax', 'datePosted', 'applicationDeadline'],
                subQuery: false // Tắt subquery để tránh một số vấn đề với điều kiện phức tạp
            }),
            // Lấy recommendations (có cache)
            user_id ? getRecommendations(user_id) : Promise.resolve([])
        ]);
        const recSet = new Set(recIds.map(Number));

        // Tối ưu: Lấy tất cả company một lần thay vì loop
        const companyIds = [...new Set(listJob.map(j => j.companyId))];
        const companies = await CompanyUser.findAll({
            where: { userId: companyIds },
            attributes: ['userId', 'name', 'logoUrl', 'areaId'],
            include: { model: Area, attributes: ['province'] }
        });
        const companyMap = new Map(companies.map(c => [c.userId, c]));

        // Map jobs nhanh hơn
        const jobMap = new Map();
        const jobs = listJob.map(job => {
            const company = companyMap.get(job.companyId);
            const normalized = {
                ...job.toJSON(),
                companyName: company?.name ?? '',
                logoUrl: company?.logoUrl ?? '',
                companyAddress: company?.Area?.province ?? '',
                applicationDeadline: getTimeLeft(job.applicationDeadline),
                datePosted: moment(job.datePosted).format('YYYY-MM-DD HH:mm:ss'),
                isExpired: new Date(job.applicationDeadline) < now,
                isRecommend: recSet.has(Number(job.id))
            };
            jobMap.set(job.id, normalized);
            return normalized;
        });

        const recommended = recIds
            .map(id => jobMap.get(id))
            .filter(Boolean);
        // const recommended = recIds
        //     .map(Number)
        //     .map(id => jobMap.get(id))
        //     .filter(job => job && !job.isExpired);
        const others = jobs.filter(j => !recSet.has(j.id));

        return { status: 200, data: [...recommended, ...others] };
    } catch (err) {
        console.error(err);
        return { status: 500, data: { message: messages.error.ERR_INTERNAL } };
    }
};

const filterAllRecruitmentNews = async (filterData, user_id) => {
    try {

        const { currentNewsId, keyword, profession, area, experience, jobLevel, salaryMin, salaryMax, workType, sortBy, order } = filterData;
        const whereCondition = {};
        const orderCondition = [];
        const includeOptions = [];

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
            const professionArray = profession.split(',').map(prof => prof.trim()).filter(prof => prof);
            if (professionArray.length > 0) {
                whereCondition.profession = { [Op.in]: professionArray };
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
        } else if (sortBy === 'experience') {
            orderBy = sequelize.literal(`CASE 
                WHEN experience = N'Không yêu cầu' THEN 0
                WHEN experience = N'Dưới 1 năm' THEN 1
                WHEN experience = N'0-1 năm' THEN 2
                WHEN experience = N'1-3 năm' THEN 3
                WHEN experience = N'3-5 năm' THEN 4
                WHEN experience = N'Trên 5 năm' THEN 5
                ELSE 6
            END`);
        } else {
            orderBy = sortBy && validSortFields.includes(sortBy) ? sortBy : 'datePosted';
        }
        const orderDirection = order === 'ASC' ? 'ASC' : 'DESC';
        orderCondition.push([orderBy, orderDirection]);

        // if (Object.keys(whereCondition).length === 0 && user_id) {
        //     return await getAllRecruitmentNews(user_id);
        // }

        return await getAllRecruitmentNews(user_id, whereCondition, orderCondition, includeOptions);

        // const jobs = await RecruitmentNews.findAll({
        //     where: { ...whereCondition, status: messages.recruitmentNews.status.APPROVED },
        //     order: orderCondition,
        //     include: includeOptions,
        //     attributes: ['id', 'companyId', 'jobTitle', 'profession', 'salaryMin', 'salaryMax', 'datePosted', 'applicationDeadline'],
        //     subQuery: false // Tắt subquery để tránh một số vấn đề với điều kiện phức tạp
        // });

        // const data = await Promise.all(jobs.map(async job => {
        //     let company = job.CompanyUser;
        //     if (!company) {
        //         company = await CompanyUser.findByPk(job.companyId, {
        //             attributes: ['name', 'logoUrl'],
        //             include: {
        //                 model: Area,
        //                 attributes: ['province'],
        //             }
        //         });
        //     }

        //     return {
        //         id: job.id,
        //         companyId: job.companyId,
        //         jobTitle: job.jobTitle,
        //         profession: job.profession,
        //         salaryMin: job.salaryMin,
        //         salaryMax: job.salaryMax,
        //         companyName: company?.name || null,
        //         logoUrl: company?.logoUrl || null,
        //         companyAddress: job.Area?.province || company?.Area?.province || null,
        //         applicationDeadline: getTimeLeft(job.applicationDeadline),
        //         datePosted: moment(job.datePosted).format('YYYY-MM-DD HH:mm:ss')
        //     };
        // }));
    } catch (err) {
        console.log(err);
        return { status: 500, data: { message: messages.error.ERR_INTERNAL } };
    }
};

const getDetailRecruitmentNews = async (recruitmentNewsId, userId) => {
    try {
        const recruitmentNews = await RecruitmentNews.findByPk(recruitmentNewsId, {
            include: [{
                model: Area,
                attributes: ['province', 'district'],
            }, {
                model: CompanyUser,
                attributes: ['userId', 'name', 'field', 'companySize', 'companyAddress', 'logoUrl'],
            }]
        });
        const existed = await JobApplication.findOne({
            include: [{
                model: PersonalUser,
                attributes: [],
                where: { userId }
            }],
            where: { recruitmentNewsId },
            attributes: ['id']
        });
        const isApplied = !!existed;

        const saveNews = await NewsMarks.findOne({
            where: {
                personalId: userId,
                recruitmentNewsId
            }
        });
        const isSaved = !!saveNews;

        const data = recruitmentNews.toJSON();
        const job = {
            general: {
                jobLevel: data.jobLevel,
                candidateNumber: data.candidateNumber,
                workType: data.workType
            },
            introduce: {
                jobTitle: data.jobTitle,
                salaryMin: data.salaryMin,
                salaryMax: data.salaryMax,
                salaryRange: `${data.salaryMin}-${data.salaryMax}`,
                address: data.Area.province,
                district: data.Area.district,
                experience: data.experience,
                applicationDeadline: getTimeLeft(data.applicationDeadline),
                applicationDeadlineDate: data.applicationDeadline,
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
            },
            parentId: data.parentId,
            status: {
                isApplied,
                isSaved
            }
        }

        return { status: 200, data: job };
    } catch (error) {
        console.log(error);
        return { status: 500, data: { message: messages.error.ERR_INTERNAL } };
    }
};
export default { getAllRecruitmentNews, filterAllRecruitmentNews, getDetailRecruitmentNews };