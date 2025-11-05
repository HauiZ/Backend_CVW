import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import User from './User.js';
import Area from './Area.js';

class PersonalUser extends Model { }

PersonalUser.init({
    userId: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id'
        },
        primaryKey: true,
    },
    googleId: {
        type: DataTypes.STRING,
        allowNull: true,
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
    avatarId: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    avatarUrl: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    desiredJob: {
        type: DataTypes.STRING,
        allowNull: true,
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
    expectedSalary: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    yearsExperience: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    currentLevel: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    about: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    location: {
        type: DataTypes.STRING,
        allowNull: true,
    },  
}, {
    sequelize,
    modelName: 'PersonalUser',
    tableName: 'Personal_User',
    timestamps: false,
});


export default PersonalUser;