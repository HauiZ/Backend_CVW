import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import CompanyUser from './CompanyUser.js';
import Area from './Area.js';
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
    jobTitle: {    // vi tri tuyen dung
        type: DataTypes.STRING,
        allowNull: false,
    },
    profession: { // nganh nghe
        type: DataTypes.STRING,
        allowNull: false,
    },
    candidateNumber: { // số lượng đăng tuyển
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    jobLevel: { // cap bac
        type: DataTypes.STRING,
        allowNull: false,
    },
    workType: { // hinh thuc lam viec
        type: DataTypes.STRING,
        allowNull: false,
    },
    degree: {
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
    jobAddress: { // dia chi cu the, so nha, duong
        type: DataTypes.STRING,
        allowNull: false,
    },
    salaryMin: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    salaryMax: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    salaryNegotiable: { // hoa hồng
        type: DataTypes.BOOLEAN,
        allowNull: true,
        get() {
            const value = this.getDataValue('salaryNegotiable');
            return value === null || value === undefined ? true : value;
        }
    },
    experience: {
        type: DataTypes.STRING,
        allowNull: false,
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
    contactPhone: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    contactEmail: {
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
    datePosted: {
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
    modelName: 'RecruitmentNews',
    timestamps: false,
    tableName: 'Recruitment_News',
})

export default RecruitmentNews;