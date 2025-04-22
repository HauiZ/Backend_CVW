import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import RecruitmentNews from './RecruitmentNews.js';

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