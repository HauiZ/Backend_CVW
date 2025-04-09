import sequelize from '../config/database.js';
import User from './User.js';
import Role from './Role.js';
import Area from './Area.js';
import CompanyUser from './CompanyUser.js';
import CV from './CV.js';
import JobApplication from './JobApplication.js';
import PersonalUser from './PersonalUser.js';
import RecruitmentNews from './RecruitmentNews.js';


User.belongsTo(Role, {foreignKey: 'roleId'});
Role.hasMany(User, {foreignKey: 'roleId'});

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


const models = { sequelize, User, Role, PersonalUser, CV, JobApplication, RecruitmentNews, Area, CompanyUser};

export default models;