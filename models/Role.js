import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

class Role extends Model {}

Role.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    discription: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    displayName: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    sequelize,
    modelName: 'Role',
    tableName: 'Role', 
    timestamps: false, 
});

export default Role;