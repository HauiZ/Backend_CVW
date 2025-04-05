const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const CompanyUser = require('./CompanyUser');
const Area = require('./Area');
class RecruitmentNews extends Model { }

RecruitmentNews.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
    },
    companyId: {
        type: DataTypes.INTEGER,
        references: {
            model: CompanyUser,
            key: 'userId',
        },
        allowNull: false,
    },
    jobTitle: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    candidate: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    jobLevel: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    workType: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    areaId: {
        type: DataTypes.INTEGER,
        references: {
            model: Area,
            key: 'id',
        },
        allowNull: false,
    },
    jobAddress: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    salaryRange: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    salaryNegotiable: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        get() {
            const value = this.getDataValue('salaryNegotiable');
            return value === null || value === undefined ? true : value;
        }
    },
    workDateIn: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    workDetail: {
        type: DataTypes.TEXT,
        allowNull: false,
        get() {
            const value = this.getDataValue('workDetail');
            return value ? JSON.parse(value) : null;
        },
        set(value) {
            this.setDataValue('workDetail', JSON.stringify(value));
        }
    },
    jobRequirements: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    benefits: {
        type: DataTypes.TEXT,
        allowNull: false,
        get() {
            const value = this.getDataValue('benefits');
            return value ? JSON.parse(value) : null;
        },
        set(value) {
            this.setDataValue('benefits', JSON.stringify(value));
        }
    },
    applicationDealine: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    contactInfo: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    contactAddress: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isEmail: true,
        },
    },
    videoUrl: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    

}, {
    sequelize,
    modelName: 'RecruitmentNews',
    timestamps: false,
    tableName: 'Recruitment_News',
})

module.exports = RecruitmentNews;