import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import JobApplication from './JobApplication.js';
import PersonalUser from './PersonalUser.js';

class Notification extends Model { }

Notification.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    applyId: {
        type: DataTypes.INTEGER,
        references: {
            model: JobApplication,
            key: 'id',
        },
        allowNull: false,
    },
    sender: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    receiverId: {
        type: DataTypes.INTEGER,
        references: {
            model: PersonalUser,
            key: 'userId'
        },
        allowNull: false,
    },
    receiver: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    content: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    sentAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },

}, {
    sequelize,
    modelName: 'Notification',
    tableName: 'Notification',
    timestamps: false,
});

export default Notification;