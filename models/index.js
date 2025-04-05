const sequelize = require('../config/database');
const User = require('./User');
const Role = require('./Role');
const UserRole = require('./UserRole');
const Area = require('./Area');
const CompanyUser = require('./CompanyUser');
const CV = require('./CV');
const JobApplication = require('./JobApplication');
const PersonalUser = require('./PersonalUser');
const RecruitmentNews = require('./RecruitmentNews');


User.belongsToMany(Role, { 
    through: UserRole,
    foreignKey: 'userId',
    otherKey: 'roleId'
});

Role.belongsToMany(User, { 
    through: UserRole,
    foreignKey: 'roleId',
    otherKey: 'userId'
});

CompanyUser.belongsTo(User, { foreignKey: 'userId' });
User.hasOne(CompanyUser, { foreignKey: 'userId' });

CV.belongsTo(PersonalUser, { foreignKey: 'PersonalId' });
PersonalUser.hasMany(CV, { foreignKey: 'PersonalId' });

RecruitmentNews.belongsToMany(CV, {
    through: JobApplication,
    foreignKey: 'recruitmentNewsId',
    otherKey: 'cvId',
    as: 'AppliedCVs'
});

CV.belongsToMany(RecruitmentNews, {
    through: JobApplication,
    foreignKey: 'cvId',
    otherKey: 'recruitmentNewsId',
    as: 'JobApplications'
});

PersonalUser.belongsTo(User, { foreignKey: 'userId' });
User.hasOne(PersonalUser, { foreignKey: 'userId' });

RecruitmentNews.belongsTo(Area, { foreignKey: 'areaId' });
Area.hasMany(RecruitmentNews, { foreignKey: 'areaId' });

CompanyUser.belongsTo(Area, { foreignKey: 'areaId' });
Area.hasMany(CompanyUser, { foreignKey: 'areaId' });


const models = { sequelize, User, Role, UserRole, PersonalUser, CV, JobApplication, RecruitmentNews, Area, CompanyUser};

module.exports = models;