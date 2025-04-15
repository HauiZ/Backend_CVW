import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import CV from './CV.js';
import RecruitmentNews from './RecruitmentNews.js';
import User from './User.js';
import CvFiles from './CvFiles.js';

class JobApplication extends Model { }

JobApplication.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    cvId: {
        type: DataTypes.INTEGER,
        references: {
            model: CvFiles,
            key: 'id',
        },
        allowNull: false,
    },
    recruitmentNewsId: {
        type: DataTypes.INTEGER,
        references: {
            model: RecruitmentNews,
            key: 'id',
        },
        allowNull: false,
    },
    nameApplicant: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    avatarApllicant: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    jobTitle: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    applyDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
    },

}, {
    sequelize,
    timestamps: false,
    modelName: 'JobApplication',
    tableName: 'Job_Application',
})


export default JobApplication;