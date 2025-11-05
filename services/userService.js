import User from '../models/User.js';
import Role from '../models/Role.js';
import PersonalUser from '../models/PersonalUser.js';
import bcrypt from 'bcryptjs';
import CompanyUser from '../models/CompanyUser.js';
import Area from '../models/Area.js';
import sequelize from '../config/database.js';
import CvFiles from '../models/CvFiles.js';
import drive from "../config/googleDrive/driveconfig.js";
import messages from '../config/message.js';
import checkFormatPassword from '../helper/fomatPassword.js';
import JobApplication from '../models/JobApplication.js';
import uploadCvService from './upload/uploadCvService.js';
import RecruitmentNews from '../models/RecruitmentNews.js';
import moment from 'moment-timezone';
import Notification from '../models/Notification.js';
import NewsMarks from '../models/NewsMarks.js';
import CVTemplate from '../models/CVTemplate.js';
import { getTimeLeft } from "../utils/getTimeLeft.js";
import { Sequelize } from 'sequelize';

const registerUser = async (userData, roleName) => {
    const transaction = await sequelize.transaction();
    try {
        const { userName, email, password, confirmPassword, businessName, phone, province, district } = userData;

        const role = await Role.findOne({ where: { name: roleName }, transaction });
        if (!role) {
            return { status: 400, data: { message: `PERMISSION ${roleName} NOT IN SYSTEM` } };
        }

        const checkPass = checkFormatPassword(password, confirmPassword);
        if (checkPass !== true) {
            if (!transaction.finished) {
                await transaction.rollback();
            }
            return { status: checkPass.status, data: { message: checkPass.data } }
        }
        // check xem email đã tồn tại trong hệ thống với role mà người dùng muốn đăng ký không
        const uniqueEmail = await User.findOne({
            where: { email: email },
            include: [{ model: Role, where: { name: roleName } }]
            , transaction
        });

        if (uniqueEmail && uniqueEmail.Role) {
            return { status: 400, data: { message: `EMAIL DOES EXISTS WITH PERMISSION ${roleName}` } };
        }

        // const saltRounds = 10;
        // const hashedPassword = await bcrypt.hash(password, saltRounds);

        const user = await User.create({ email, password, typeAccount: 'LOCAL' }, { transaction });
        await user.setRole(role, { transaction });
        const responseData = { message: messages.user.USER_CREATED_SUCCESSFULLY };

        if (roleName === "candidate") {
            await PersonalUser.create({ userId: user.id, name: userName, email }, { transaction });
        } else if (roleName === "recruiter") {
            let area = await Area.findOne({ where: { province, district }, transaction });
            if (!area) {
                area = await Area.create({ province, district }, { transaction });
            }
            await CompanyUser.create({ userId: user.id, name: businessName, email, phone, areaId: area.id }, { transaction });
        }

        await transaction.commit();
        return { status: 200, data: responseData };

    } catch (error) {
        if (!transaction.finished) {
            await transaction.rollback();
        }
        return { status: 500, data: { message: messages.error.ERR_INTERNAL } };
    }
};

const getUserProfile = async (userId) => {
    try {
        const user = await User.findByPk(userId, {
            attributes: { exclude: ['password'] },
            include: [
                { model: Role, as: 'Role', attributes: ["name"] },
                { model: PersonalUser, as: 'PersonalUser' },
                { model: CompanyUser, as: 'CompanyUser', include: [{ model: Area, as: 'Area' }] }
            ]
        });

        if (!user) {
            return { status: 404, data: { message: messages.user.ERR_USER_NOT_EXISTS } };
        }

        const userRole = user.Role.name;
        let userInfo;

        if (userRole === 'candidate' && user.PersonalUser) {
            userInfo = {
                userName: user.PersonalUser.name,
                email: user.PersonalUser.email,
                phone: user.PersonalUser.phone,
                avatarUrl: user.PersonalUser.avatarUrl ? user.PersonalUser.avatarUrl : null,
                typeAccount: user.typeAccount,
                desiredJob: user.PersonalUser.desiredJob,
                skills: user.PersonalUser.skills ? user.PersonalUser.skills : [],
                expectedSalary: user.PersonalUser.expectedSalary,
                yearsExperience: user.PersonalUser.yearsExperience,
                currentLevel: user.PersonalUser.currentLevel,
                about: user.PersonalUser.about,
                location: user.PersonalUser.location,
            };
        } else if (userRole === 'recruiter' && user.CompanyUser) {
            userInfo = {
                businessName: user.CompanyUser.name,
                email: user.CompanyUser.email,
                phone: user.CompanyUser.phone,
                province: user.CompanyUser.Area.province,
                district: user.CompanyUser.Area.district,
                companyAddress: user.CompanyUser.companyAddress,
                field: user.CompanyUser.field,
                companySize: user.CompanyUser.companySize,
                website: user.CompanyUser.website,
                introduction: user.CompanyUser.introduction,
                logoUrl: user.CompanyUser.logoUrl ? user.CompanyUser.logoUrl : null,
            };
        }

        return { status: 200, data: { message: messages.user.GET_INFO, role: userRole, user: userInfo } };

    } catch (error) {
        console.log(error);
        return { status: 500, data: { message: messages.error.ERR_INTERNAL } };
    }
};

const changePassword = async (userId, newPasswordData) => {
    try {
        const { oldPassword, newPassword, confirmNewPassword } = newPasswordData;
        const user = await User.findByPk(userId);
        if (user.typeAccount === 'LOCAL') {
            if (oldPassword !== user.password) {
                return { status: 400, data: { message: messages.auth.ERR_INCORRECT_PASSWORD } };
            }
        }
        const checkPass = checkFormatPassword(newPassword, confirmNewPassword);
        if (checkPass !== true) {
            return { status: checkPass.status, data: { message: checkPass.data } }
        }
        await user.update({ password: newPassword });
        if (user.typeAccount === 'GOOGLE') {
            await user.update({ typeAccount: 'LOCAL' });
        }
        return { status: 200, data: { message: messages.auth.CHANGE_PASSWORD_SUCCESS } };
    } catch (error) {
        console.log(error)
        return { status: 500, data: { message: messages.error.ERR_INTERNAL } }
    }
};

const changeProfile = async (userId, dataProfile) => {
    try {
        const { name, phone, desiredJob, skills, expectedSalary, yearsExperience, currentLevel, about, location, province, district, companyAddress, field, companySize, website, introduction } = dataProfile;
        if (!name) {
            return { status: 400, data: { message: messages.user.BLANK_NAME } };
        }

        const user = await User.findByPk(userId, {
            include: [{ model: Role, attributes: ['name'] }]
        });
        if (user.Role.name === 'candidate') {
            const personal = await PersonalUser.findByPk(userId);
            const updates = { name, phone, desiredJob, skills, expectedSalary, yearsExperience, currentLevel, about, location };
            for (const field of Object.keys(updates)) {
                if (updates[field] !== personal[field]) {
                    await personal.update({ [field]: updates[field] });
                }
            }
        } else if (user.Role.name === 'recruiter') {
            const company = await CompanyUser.findByPk(userId, {
                include: [{ model: Area }],
            })
            if (!province || !district) {
                return { status: 400, data: { message: messages.user.BLANK_AREA } };
            }
            if (province !== company.Area.province && district !== company.Area.district) {
                const area = await Area.findOne({
                    where: { province: province, district: district },
                    attributes: ['id']
                });
                await company.update({ areaId: area.id });
            }
            // kiểm tra xem có thay đổi thông tin công ty không, nếu có thì cập nhật
            const updates = { name, phone, companyAddress, field, companySize, website, introduction };
            for (const field of Object.keys(updates)) {
                if (updates[field] !== company[field]) {
                    await company.update({ [field]: updates[field] });
                }
            }
        }
        return { status: 200, data: { message: messages.user.USER_UPDATED_SUCCESSFULLY } };
    } catch (error) {
        console.log(error);
        return { status: 500, data: { message: messages.error.ERR_INTERNAL } };
    }
};

const applyJob = async (userId, recruitmentNewsId, file) => {
    try {
        const recruitmentNews = await RecruitmentNews.findByPk(recruitmentNewsId, {
            attributes: ['id', 'jobTitle', 'applicationDeadline', 'companyId'],
        });
        if (new Date().getTime() > recruitmentNews.applicationDeadline.getTime()) {
            return { status: 400, data: { message: messages.application.ERR_DEADLINE_APPLICATION } };
        }
        const user = await PersonalUser.findByPk(userId, {
            attributes: ['name', 'avatarUrl'],
        });
        const company = await CompanyUser.findByPk(recruitmentNews.companyId, {
            attributes: ['userId', 'name'],
        });
        const dataCv = await uploadCvService.uploadCV(file, userId);
        const cvId = dataCv.data.cvId;
        await JobApplication.create({
            userId: userId, cvId: cvId,
            recruitmentNewsId: recruitmentNewsId,
            applicantId: userId,
            jobTitle: recruitmentNews.jobTitle,
            status: messages.recruitmentNews.status.PENDING
        });
        await Notification.create({
            sender: user.name,
            senderAvatar: user.avatarUrl,
            receiverId: company.userId,
            receiver: company.name,
            title: `Ứng tuyển công việc`,
            content: `${user.name} đã ứng tuyển vào ${recruitmentNews.jobTitle} { Bài viết số ${recruitmentNews.id} }`,
        });
        return { status: 200, data: { message: messages.recruitmentNews.APPLY_SUCCESS } };
    } catch (error) {
        console.log(error);
        return { status: 500, data: { message: messages.error.ERR_INTERNAL } };
    }

};

const getInfoCompany = async (companyId) => {
    try {
        const companyData = await CompanyUser.findByPk(companyId);
        const listJob = await RecruitmentNews.findAll({
            where: { companyId: companyId, status: messages.recruitmentNews.status.APPROVED },
            attributes: ['id', 'jobTitle', 'profession', 'salaryMin', 'salaryMax', 'datePosted', 'applicationDeadline'],
            include: [{
                model: Area,
                attributes: ['province']
            }]
        });
        if (listJob) {
            const jobs = listJob.map(job => {
                const data = job.toJSON();
                return {
                    id: job.id,
                    jobTitle: job.jobTitle,
                    profession: job.profession,
                    salaryMin: job.salaryMin,
                    salaryMax: job.salaryMax,
                    applicationDeadline: getTimeLeft(job.applicationDeadline),
                    datePosted: moment(data.datePosted).format('YYYY-MM-DD HH:mm:ss'),
                    companyAddress: job.Area.province,
                };
            })
            return { status: 200, data: { companyData, jobs } };
        }
        return { status: 200, data: { companyData } };
    } catch (error) {
        console.log(error);
        return { status: 500, data: { message: messages.error.ERR_INTERNAL } };
    }

};

const getAllCompany = async () => {
    try {
        const listCompany = await CompanyUser.findAll({
            attributes: {
                include: [
                    [Sequelize.fn('COUNT', Sequelize.col('RecruitmentNews.id')), 'jobCount'] // đếm số lượng công việc
                ],
                exclude: ['phone', 'email', 'areaId', 'companyAddress', 'companySize', 'website', 'introduction', 'logoId']
            },
            include: [{
                model: RecruitmentNews,
                as: 'RecruitmentNews',
                attributes: []
            }],
            group: [
                'CompanyUser.userId',
                'CompanyUser.name',
                'CompanyUser.field',
                'CompanyUser.logoUrl'
            ],
            order: [[Sequelize.literal('jobCount'), 'DESC']], // sắp xếp theo số lượng công việc giảm dần
        })
        const topCompany = listCompany.slice(0, 9); // lấy 9 công ty hàng đầu
        const data = await Promise.all(topCompany.map(async company => {
            const data = company.toJSON();
            const { userId, jobCount, ...current } = data;
            return {
                id: company.userId,
                ...current,
                jobNumber: jobCount,
            }
        }))
        return { status: 200, data: data };
    } catch (error) {
        console.log(error);
        return { status: 500, data: { message: messages.error.ERR_INTERNAL } };
    }
};

const getNotification = async (userId) => {
    try {
        // const thirtyDaysAgo = moment().subtract(30, 'days').toDate();
        // await Notification.destroy({
        //     where: {
        //         sentAt: {
        //             [Op.lt]: thirtyDaysAgo 
        //         }
        //     }
        // });
        const notifications = await Notification.findAll({
            where: { receiverId: userId },
        })
        const listNotification = notifications.map(noti => {
            const data = noti.toJSON();
            return {
                ...data,
                sentAt: moment(data.sentAt).format('YYYY-MM-DD HH:mm:ss')
            }
        })
        return { status: 200, data: listNotification.sort((a, b) => b.id - a.id) };
    } catch (error) {
        console.log(error);
        return { status: 500, data: { message: messages.error.ERR_INTERNAL } };
    }
};

const getTemplateCV = async () => {
    try {
        const listTemplate = await CVTemplate.findAll({
            attributes: ['id', 'name', 'templateUrl', 'displayUrl', 'propoties'],
        });
        return { status: 200, data: listTemplate.sort((a, b) => b.id - a.id) };
    } catch (error) {
        console.log(error);
        return { status: 500, data: { message: messages.error.ERR_INTERNAL } };
    }
};

const getDetailTemplateCV = async (templateId) => {
    try {
        const template = await CVTemplate.findByPk(templateId, {
            attributes: ['url'],
        })
        return { status: 200, data: template };
    } catch (error) {
        console.log(error);
        return { status: 500, data: { message: messages.error.ERR_INTERNAL } };
    }
};

const getInfoApplication = async (userId) => {
    try {
        const listApply = await JobApplication.findAll({
            include: [{
                model: RecruitmentNews,
                where: { status: messages.recruitmentNews.status.APPROVED },
                attributes: ['id', 'companyId', 'jobTitle', 'profession', 'salaryMin', 'salaryMax', 'datePosted'],
                include: [{
                    model: CompanyUser,
                    attributes: ['name', 'logoUrl'],
                    include: [{
                        model: Area,
                        attributes: ['province']
                    }]
                }]
            }, {
                model: CvFiles,
                where: { personalId: userId },
                attributes: ['urlView'],
            }],
        });
        const data = listApply.map(apply => {
            const data = apply.toJSON();
            return {
                id: data.id,
                status: data.status,
                cvUrl: data.CvFile?.urlView,
                applyDate: moment(data.applyDate).format('YYYY-MM-DD HH:mm:ss'),
                recruitmentNews: {
                    id: data.RecruitmentNew?.id,
                    jobTitle: data.RecruitmentNew?.jobTitle,
                    companyName: data.RecruitmentNew?.CompanyUser?.name || null,
                    logoUrl: data.RecruitmentNew?.CompanyUser?.logoUrl || null,
                    companyAddress: data.RecruitmentNew?.CompanyUser?.Area?.province || null,
                    datePosted: moment(data.RecruitmentNew?.datePosted).format('YYYY-MM-DD HH:mm:ss'),
                }
            };
        });
        return { status: 200, data: data };
    } catch (error) {
        console.log(error);
        return { status: 500, data: { message: messages.error.ERR_INTERNAL } };
    }
};

const getInfoArea = async () => {
    try {
        const areas = await Area.findAll();
        // nhóm các khu vực theo tỉnh
        const result = Object.values(
            areas.reduce((acc, area) => {
                const key = area.province;
                if (!acc[key]) {
                    acc[key] = {
                        province: area.province,
                        districts: [area.district]
                    };
                } else {
                    acc[key].districts.push(area.district);
                }
                return acc;
            }, {})
        );
        return { status: 200, data: result };
    } catch (error) {
        console.log(error);
        return { status: 500, data: { message: messages.error.ERR_INTERNAL } };
    }
};

const saveNews = async (recruitmentNewsId, userId) => {
    try {
        const existingMark = await NewsMarks.findOne({ where: { recruitmentNewsId, personalId: userId } });
        if (existingMark) {
            await existingMark.destroy();
            return { status: 200, data: { message: 'removed successfully' } };
        }
        const newsMark = await NewsMarks.create({ recruitmentNewsId, personalId: userId });
        return { status: 200, data: { message: newsMark ? 'save successfully' : 'fail' } };
    } catch (error) {
        console.log(error);
        return { status: 500, data: { message: messages.error.ERR_INTERNAL } };
    }
};

const getAllNewsSaved = async (userId) => {
    try {
        const rows = await RecruitmentNews.findAll({
            attributes: ['id', 'companyId', 'jobTitle', 'profession', 'salaryMin', 'salaryMax', 'datePosted', 'applicationDeadline'],
            include: [
                { model: NewsMarks, where: { personalId: userId }, attributes: [] },
                {
                    model: CompanyUser, attributes: ['name', 'logoUrl'],
                    include: [{ model: Area, attributes: ['province'] }]
                }
            ],
        });

        const news = rows.map(r => ({
            id: r.id,
            companyId: r.companyId,
            jobTitle: r.jobTitle,
            profession: r.profession,
            salaryMin: r.salaryMin,
            salaryMax: r.salaryMax,
            datePosted: moment(r.datePosted).format('YYYY-MM-DD HH:mm:ss'),
            companyName: r.CompanyUser.name,
            logoUrl: r.CompanyUser.logoUrl,
            companyAddress: r.CompanyUser.Area.province,
            applicationDeadline: getTimeLeft(r.applicationDeadline),
        }));

        return { status: 200, data: news };
    } catch (error) {
        console.log(error);
        return { status: 500, data: { message: messages.error.ERR_INTERNAL } };
    }
}
export default {
    registerUser, getUserProfile, changePassword, changeProfile, applyJob, getInfoCompany,
    getNotification, getAllCompany, getTemplateCV, getDetailTemplateCV, getInfoApplication, getInfoArea
    , saveNews, getAllNewsSaved
};