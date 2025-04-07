import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import User from './User.js';
import Role from './Role.js';

class UserRole extends Model {}

UserRole.init({
    userId: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id'
        },
        primaryKey: true
    },
    roleId: {
        type: DataTypes.INTEGER,
        references: {
            model: Role,
            key: 'id'
        },
        primaryKey: true
    },
    assignedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    sequelize,
    modelName: 'UserRole',
    tableName: 'User_Roles',
    timestamps: false,
    indexes: [
        {
            unique: true,
            fields: ['userId', 'roleId']
        }
    ]
});


export default UserRole;