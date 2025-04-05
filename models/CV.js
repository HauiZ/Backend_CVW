const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const PersonalUser = require('./PersonalUser');

class CV extends Model { }

CV.init({
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    PersonalId: {
        type: DataTypes.INTEGER,
        references: {
            model: PersonalUser,
            key: 'userId',
        },
        allowNull: false,
    },
    fullName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    jobTitle: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    careerObjective: {
        type: DataTypes.TEXT,
        allowNull: true,
        get() {
            const value = this.getDataValue('careerObjective');
            return value ? JSON.parse(value) : null;
        },
        set(value) {
            this.setDataValue('careerObjective', JSON.stringify(value));
        }
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isEmail: true,
        },
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    education: {
        type: DataTypes.TEXT,
        allowNull: true,
        get() {
            const value = this.getDataValue('education');
            return value ? JSON.parse(value) : null;
        },
        set(value) {
            this.setDataValue('education', JSON.stringify(value));
        }
    },
    skills: {
        type: DataTypes.TEXT,
        allowNull: true,
        get() {
            const value = this.getDataValue('skills');
            return value ? JSON.parse(value) : null;
        },
        set(value) {
            this.setDataValue('skills', JSON.stringify(value));
        }
    },
    workExperience: {
        type: DataTypes.TEXT,
        allowNull: true,
        get() {
            const value = this.getDataValue('workExperience');
            return value ? JSON.parse(value) : null;
        },
        set(value) {
            this.setDataValue('workExperience', JSON.stringify(value));
        }
    },
    salaryExpectation: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    createbyWeb: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        get() {
            const value = this.getDataValue('createbyWeb');
            return value === null || value === undefined ? true : value;
        }
    },
}, {
    sequelize,
    modelName: 'CV',
    timestamps: false,
    tableName: 'CV',
})


module.exports = CV;