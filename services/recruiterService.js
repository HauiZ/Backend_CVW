import sequelize from '../config/database.js';
import messages from "../config/message.js";
import Request from "../models/Request.js";
import RecruitmentNews from "../models/RecruitmentNews.js";
import Area from '../models/Area.js';
import CompanyUser from "../models/CompanyUser.js";

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
        return { status: 500, data: { message: messages.error.ERR_INTERNAL, error } };
    }


}
const checkRecruitmentNewsData = (recruitmentNewsData) => {
    const requiredFields = [
        'jobTitle', 'profession', 'candidateNumber', 'jobLevel', 'workType', 'province',
        'district', 'domain', 'jobAddress', 'salaryMin', 'salaryMax', 'salaryNegotiable',
        'experience', 'workDateIn', 'workDetail', 'jobRequirements', 'benefits',
        'applicationDealine', 'contactInfo', 'contactAddress', 'contactPhone',
        'contactEmail', 'videoUrl'
    ];

    const missingFields = requiredFields.filter(field => {
        return recruitmentNewsData[field] === undefined || recruitmentNewsData[field] === null;
    });

    return missingFields;
};

export default {postRecruitmentNews};