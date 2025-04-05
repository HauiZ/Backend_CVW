const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const Role = require('./Role');

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


module.exports = UserRole;