const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const CV = require('./CV');
const RecruitmentNews = require('./RecruitmentNews');
const User = require('./User');

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
            model: CV,
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


module.exports = JobApplication;