const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const Area = require('./Area');
class CompanyUser extends Model { }

CompanyUser.init({
    userId: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id'
        },
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isEmail: true,
        },
    },
    areaId: {
        type: DataTypes.INTEGER,
        references: {
            model: Area,
            key: 'id',
        },
        allowNull: false,
    },
    field: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    companySize: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    website: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    sequelize,
    modelName: 'CompanyUser',
    tableName: 'Company_User',
    timestamps: false,
});


module.exports = CompanyUser;