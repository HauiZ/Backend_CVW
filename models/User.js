import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Role from './Role.js';

class User extends Model {}

User.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    roleId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Role,
            key: 'id',
        },
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isEmail: true,
        },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    typeAccount: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    otpCode: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    otpExpiresAt: {
        type: DataTypes.DATE,
        allowNull: true,
    },
}, {
    sequelize,
    modelName: 'User',
    tableName: 'Users', 
    timestamps: false, 
});

export default User;