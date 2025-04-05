const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

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

module.exports = Area;