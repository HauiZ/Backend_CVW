import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import RecruitmentNews from './RecruitmentNews.js';
import CompanyUser from './CompanyUser.js';

class Request extends Model { }

Request.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    recruitmentNewsId: {
        type: DataTypes.INTEGER,
        references: {
            model: RecruitmentNews,
            key: 'id',
        },
        allowNull: false,
    },
    senderId: {
        type: DataTypes.INTEGER,
        references: {
            model: CompanyUser,
            key: 'userId',
        },
        allowNull: false,
    },
    sender: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    typeOf: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    createAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    isReviewed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    }
}, {
    sequelize,
    modelName: 'Request',
    tableName: 'Request',
    timestamps: false,
});

export default Request;