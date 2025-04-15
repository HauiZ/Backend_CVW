
import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';
import PersonalUser from './PersonalUser.js';

class CvFiles extends Model { }

CvFiles.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    personalId: {
        type: DataTypes.INTEGER,
        references: {
            model: PersonalUser,
            key: 'userId'
        },
        allowNull: false,
    },
    filename: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    fileId: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    urlView: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    urlDowload: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    uploadAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    sequelize,
    modelName: 'CvFiles',
    timestamps: false,
    tableName: 'CvFiles',
})


export default CvFiles;

