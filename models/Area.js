import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

class Area extends Model {}

Area.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    province: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    district: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    domain: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    sequelize,
    modelName: 'Area',
    tableName: 'Area', 
    timestamps: false, 
});

export default Area;