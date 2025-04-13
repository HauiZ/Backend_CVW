import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import CV from './CV.js';
import RecruitmentNews from './RecruitmentNews.js';
import User from './User.js';
import CvFiles from './CvFiles.js';

class JobApplication extends Model { }

JobApplication.init({
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id',
        },
    },
    cvId: {
        type: DataTypes.INTEGER,
        references: {
            model: CvFiles,
            key: 'id',
        },
        primaryKey: true,
    },
    recruitmentNewsId: {
        type: DataTypes.INTEGER,
        references: {
            model: RecruitmentNews,
            key: 'id',
        },
        primaryKey: true,
    },
    applyDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        get() {
            const value = this.getDataValue('status');
            return value === null || value === undefined ? true : value;
        }
    },

}, {
    sequelize,
    timestamps: false,
    modelName: 'JobApplication',
    tableName: 'Job_Application',
    indexes: [{
        unique: true,
        fields: ['cvId','recruitmentNewsId']
    }]
})


export default JobApplication;