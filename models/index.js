import sequelize from '../config/database.js';
import User from './User.js';
import Role from './Role.js';
import Area from './Area.js';
import CompanyUser from './CompanyUser.js';
import PersonalUser from './PersonalUser.js';
import RecruitmentNews from './RecruitmentNews.js';
import CvFiles from './CvFiles.js';
import Request from './Request.js';
import CVTemplate from './CVTemplate.js';
import JobApplication from './JobApplication.js';
import Notification from './Notification.js';
import NewsMarks from './NewsMarks.js';

User.belongsTo(Role, { foreignKey: 'roleId' });
Role.hasMany(User, { foreignKey: 'roleId' });

CompanyUser.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });
User.hasOne(CompanyUser, { foreignKey: 'userId', onDelete: 'CASCADE' });

CvFiles.belongsTo(PersonalUser, { foreignKey: 'personalId', onDelete: 'CASCADE' });
PersonalUser.hasMany(CvFiles, { foreignKey: 'personalId', onDelete: 'CASCADE' });

PersonalUser.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });
User.hasOne(PersonalUser, { foreignKey: 'userId', onDelete: 'CASCADE' });

RecruitmentNews.belongsTo(Area, { foreignKey: 'areaId' });
Area.hasMany(RecruitmentNews, { foreignKey: 'areaId' });

RecruitmentNews.belongsTo(CompanyUser, { foreignKey: 'companyId', onDelete: 'CASCADE' });
CompanyUser.hasMany(RecruitmentNews, { foreignKey: 'companyId', onDelete: 'CASCADE' });

CompanyUser.belongsTo(Area, { foreignKey: 'areaId' });
Area.hasMany(CompanyUser, { foreignKey: 'areaId' });

Request.belongsTo(CompanyUser, { foreignKey: 'senderId' });
CompanyUser.hasMany(Request, { foreignKey: 'senderId' });

Request.belongsTo(RecruitmentNews, { foreignKey: 'recruitmentNewsId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
RecruitmentNews.hasOne(Request, { foreignKey: 'recruitmentNewsId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });

JobApplication.belongsTo(CvFiles, { foreignKey: 'cvId' });
CvFiles.hasMany(JobApplication, { foreignKey: 'cvId' });

JobApplication.belongsTo(RecruitmentNews, { foreignKey: 'recruitmentNewsId' , onUpdate: 'CASCADE'});
RecruitmentNews.hasMany(JobApplication, { foreignKey: 'recruitmentNewsId' , onUpdate: 'CASCADE'});

JobApplication.belongsTo(PersonalUser, { foreignKey: 'applicantId' });
PersonalUser.hasMany(JobApplication, { foreignKey: 'applicantId' });

Notification.belongsTo(User, { foreignKey: 'receiverId', onDelete: 'CASCADE' });
User.hasMany(Notification, { foreignKey: 'receiverId', onDelete: 'CASCADE' });

NewsMarks.belongsTo(RecruitmentNews, { foreignKey: 'recruitmentNewsId', onDelete: 'CASCADE' });
RecruitmentNews.hasMany(NewsMarks, { foreignKey: 'recruitmentNewsId', onDelete: 'CASCADE' });

NewsMarks.belongsTo(PersonalUser, { foreignKey: 'personalId', onDelete: 'NO ACTION' });
PersonalUser.hasMany(NewsMarks, { foreignKey: 'personalId', onDelete: 'NO ACTION' });

const models = { sequelize, User, Role, Area, CvFiles, PersonalUser, CompanyUser, RecruitmentNews, Request, CVTemplate, JobApplication, Notification, NewsMarks };

export default models;