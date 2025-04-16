import sequelize from '../config/database.js';
import User from './User.js';
import Role from './Role.js';
import Area from './Area.js';
import CompanyUser from './CompanyUser.js';
import CV from './CV.js';
import PersonalUser from './PersonalUser.js';
import RecruitmentNews from './RecruitmentNews.js';
import CvFiles from './CvFiles.js';
import Request from './Request.js';
import CVTemplate from './CVTemplate.js';
import JobApplication from './JobApplication.js';
import Notification from './Notification.js';

User.belongsTo(Role, {foreignKey: 'roleId'});
Role.hasMany(User, {foreignKey: 'roleId'});

CompanyUser.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });
User.hasOne(CompanyUser, { foreignKey: 'userId', onDelete: 'CASCADE' });

CvFiles.belongsTo(PersonalUser, { foreignKey: 'personalId', onDelete: 'CASCADE' });
PersonalUser.hasMany(CvFiles, { foreignKey: 'personalId', onDelete: 'CASCADE' });

CV.belongsTo(CvFiles, { foreignKey: 'cvId', onDelete: 'CASCADE' });
CvFiles.hasOne(CV, { foreignKey: 'cvId', onDelete: 'CASCADE' });

PersonalUser.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });
User.hasOne(PersonalUser, { foreignKey: 'userId', onDelete: 'CASCADE' });

RecruitmentNews.belongsTo(Area, { foreignKey: 'areaId' });
Area.hasMany(RecruitmentNews, { foreignKey: 'areaId' });

RecruitmentNews.belongsTo(CompanyUser, { foreignKey: 'companyId', onDelete: 'CASCADE' });
CompanyUser.hasMany(RecruitmentNews, { foreignKey: 'companyId', onDelete: 'CASCADE' });

CompanyUser.belongsTo(Area, { foreignKey: 'areaId' });
Area.hasMany(CompanyUser, { foreignKey: 'areaId' });

Request.belongsTo(RecruitmentNews, {foreignKey: 'recruitmentNewsId', onDelete: 'CASCADE'});
RecruitmentNews.hasOne(Request, {foreignKey: 'recruitmentNewsId', onDelete: 'CASCADE'});

JobApplication.belongsTo(CvFiles, { foreignKey: 'cvId' });
CvFiles.hasMany(JobApplication, { foreignKey: 'cvId' });

JobApplication.belongsTo(RecruitmentNews, { foreignKey: 'recruitmentNewsId' });
RecruitmentNews.hasMany(JobApplication, { foreignKey: 'recruitmentNewsId' });

Notification.belongsTo(JobApplication, {foreignKey: 'applyId'});
JobApplication.hasOne(Notification, {foreignKey: 'applyId'});

Notification.belongsTo(PersonalUser, {foreignKey: 'receiverId'});
PersonalUser.hasMany(Notification, {foreignKey: 'receiverId'});

const models = { sequelize, User, Role, Area, CvFiles, PersonalUser, CompanyUser, CV, RecruitmentNews, Request, CVTemplate , JobApplication, Notification};

export default models;