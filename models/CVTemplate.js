import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

class CVTemplate extends Model { }

CVTemplate.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    url: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    fileId: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    fileUrl: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    propoties: {
        type: DataTypes.TEXT,
        allowNull: false,
        get() {
            const rawValue = this.getDataValue('propoties');
            return rawValue ? JSON.parse(rawValue) : [];
        },
        set(value) {
            this.setDataValue('propoties', JSON.stringify(value));
        },
    },
}, {
    sequelize,
    modelName: 'CVTemplate',
    tableName: 'CV_Template',
    timestamps: false,
});

export default CVTemplate;