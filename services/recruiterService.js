import sequelize from '../config/database.js';
import messages from "../config/message.js";
import Request from "../models/Request.js";
import RecruitmentNews from "../models/RecruitmentNews.js";
import Area from '../models/Area.js';
import CompanyUser from "../models/CompanyUser.js";
import JobApplication from '../models/JobApplication.js';
import CvFiles from '../models/CvFiles.js';
import moment from 'moment-timezone';
import Notification from '../models/Notification.js';
import PersonalUser from '../models/PersonalUser.js';

const postRecruitmentNews = async (recruitmentNewsData, companyId) => {
    const transaction = await sequelize.transaction();
    try {
        const { jobTitle, profession, candidateNumber, jobLevel, workType, province, district, domain, jobAddress,
            salaryMin, salaryMax, salaryNegotiable, experience, workDateIn, workDetail, jobRequirements, benefits, applicationDealine,
            contactInfo, contactAddress, contactPhone, contactEmail, videoUrl } = recruitmentNewsData;

        const missingFields = checkRecruitmentNewsData(recruitmentNewsData);
        if (missingFields.length > 0) {
            return { status: 400, data: { message: `Missing required fields: ${missingFields.join(', ')}` } }
        }
        let area = await Area.findOne({ where: { province, district, domain }, transaction });
        if (!area) {
            area = await Area.create({ province, district, domain }, { transaction });
        }
        const recruitmentNews = await RecruitmentNews.create({
            companyId: companyId, jobTitle, profession, candidateNumber, jobLevel, workType, areaId: area.id, jobAddress,
            salaryMin, salaryMax, salaryNegotiable, experience, workDateIn, workDetail, jobRequirements, benefits, applicationDealine,
            contactInfo, contactAddress, contactPhone, contactEmail, videoUrl, status: messages.recruitmentNews.status.PENDING
        }, { transaction });
        const companyName = await CompanyUser.findOne({
            where: { userId: companyId },
            attributes: ['name'],
            transaction,
        })
        await Request.create({
            recruitmentNewsId: recruitmentNews.id,
            sender: companyName.name,
            typeOf: messages.recruitmentNews.typeof.RECRUITMENT_NEWS,
            status: messages.recruitmentNews.status.PENDING,
        }, { transaction })
        await transaction.commit();
        return { status: 200, data: { message: messages.recruitmentNews.POST_SUCCESS } };
    } catch (error) {
        console.log(error);
        if (!transaction.finished) {
            await transaction.rollback();
        }
        return { status: 500, data: { message: messages.error.ERR_INTERNAL } };
    }


};
const checkRecruitmentNewsData = (recruitmentNewsData) => {
    const requiredFields = [
        'jobTitle', 'profession', 'candidateNumber', 'jobLevel', 'workType', 'province',
        'district', 'domain', 'jobAddress', 'salaryMin', 'salaryMax', 'salaryNegotiable',
        'experience', 'workDateIn', 'workDetail', 'jobRequirements', 'benefits',
        'applicationDealine', 'contactInfo', 'contactAddress', 'contactPhone',
        'contactEmail'
    ];

    const missingFields = requiredFields.filter(field => {
        return recruitmentNewsData[field] === undefined || recruitmentNewsData[field] === null;
    });

    return missingFields;
};

const getApplicant = async (userId) => {
    try {
        const listApplicant = await JobApplication.findAll({
            include: [{
                model: RecruitmentNews,
                where: { companyId: userId, status: messages.recruitmentNews.status.APPROVED },
                attributes: []
            }, {
                model: CvFiles,
                attributes: ['urlView', 'urlDowload'],
            }],
        });
        const data = listApplicant.map(applicant => {
            const data = applicant.toJSON();
            return {
                ...data,
                applyDate: moment(data.applyDate).format('YYYY-MM-DD HH:mm:ss')
            };
        }).sort((a, b) => a.recruitmentNewsId - b.recruitmentNewsId);
        return { status: 200, data: data };
    } catch (error) {
        return { status: 500, data: { message: messages.error.ERR_INTERNAL } };
    }
};

const approvedApplication = async (applyId, status, companyId) => {
    try {
        const request = await JobApplication.findByPk(applyId, {
            include: [{
                model: CvFiles,
                attributes: ['personalId'],
                include: [{
                    model: PersonalUser,
                    attributes: ['userId','name'],
                }],
            }],
        });
        const company = await CompanyUser.findByPk(companyId, {
            attributes: ['name'],
        });
        await request.update({ status: status });
        let content;
        if (status === messages.recruitmentNews.status.APPROVED) {
            content = messages.application.APPROVED_FEEDBACK;
        } else if (status === messages.recruitmentNews.status.REJECTED) {
            content = messages.application.REJECTED_FEEDBACK;
        }
        await Notification.create({
            applyId: request.id,
            sender: company.name,
            receiverId: request.CvFile.PersonalUser.userId,
            receiver: request.CvFile.PersonalUser.name,
            title: messages.application.TITLE_NOFI,
            content: content,
        });
        return { status: 200, data: { message: messages.application.UPDATE_SUCCESS } };
    } catch (error) {
        console.log(error);
        return { status: 500, data: { message: messages.error.ERR_INTERNAL } };
    }

};
export default { postRecruitmentNews, getApplicant, approvedApplication };