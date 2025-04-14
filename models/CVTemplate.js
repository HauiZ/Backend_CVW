import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

class CVTemplate extends Model {}

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
        allowNull: false,
    },
}, {
    sequelize,
    modelName: 'CVTemplate',
    tableName: 'CV_Template', 
    timestamps: false, 
});

export default CVTemplate;