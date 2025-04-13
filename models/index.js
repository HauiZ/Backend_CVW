import sequelize from '../config/database.js';
import User from './User.js';
import Role from './Role.js';
import Area from './Area.js';
import CompanyUser from './CompanyUser.js';
import CV from './CV.js';
import JobApplication from './JobApplication.js';
import PersonalUser from './PersonalUser.js';
import RecruitmentNews from './RecruitmentNews.js';
import CvFiles from './CvFiles.js';


User.belongsTo(Role, {foreignKey: 'roleId'});
Role.hasMany(User, {foreignKey: 'roleId'});

CompanyUser.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });
User.hasOne(CompanyUser, { foreignKey: 'userId', onDelete: 'CASCADE' });

CvFiles.belongsTo(PersonalUser, { foreignKey: 'personalId', onDelete: 'CASCADE' });
PersonalUser.hasMany(CvFiles, { foreignKey: 'personalId', onDelete: 'CASCADE' });

CV.belongsTo(CvFiles, { foreignKey: 'cvId', onDelete: 'CASCADE' });
CvFiles.hasOne(CV, { foreignKey: 'cvId', onDelete: 'CASCADE' });

RecruitmentNews.belongsToMany(CvFiles, {
    through: JobApplication,
    foreignKey: 'recruitmentNewsId',
    otherKey: 'cvId',
    as: 'AppliedCVs'
});

CvFiles.belongsToMany(RecruitmentNews, {
    through: JobApplication,
    foreignKey: 'cvId',
    otherKey: 'recruitmentNewsId',
    as: 'JobApplications'
});

PersonalUser.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });
User.hasOne(PersonalUser, { foreignKey: 'userId', onDelete: 'CASCADE' });

RecruitmentNews.belongsTo(Area, { foreignKey: 'areaId' });
Area.hasMany(RecruitmentNews, { foreignKey: 'areaId' });

CompanyUser.belongsTo(Area, { foreignKey: 'areaId' });
Area.hasMany(CompanyUser, { foreignKey: 'areaId' });


const models = { sequelize, User, Role, CvFiles, PersonalUser, CV, JobApplication, RecruitmentNews, Area, CompanyUser};

export default models;