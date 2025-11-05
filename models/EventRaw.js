import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

class EventRaw extends Model { }

EventRaw.init({
    eventId: { type: DataTypes.STRING(36), primaryKey: true },
    eventName: { type: DataTypes.STRING(64), allowNull: false },
    eventTs: { type: DataTypes.DATE, allowNull: false },
    userId: { type: DataTypes.STRING(64) },
    jobId: { type: DataTypes.STRING(64) },
}, {
    sequelize,
    modelName: 'EventRaw',
    tableName: 'EventRaw',
    timestamps: false,
});

export default EventRaw;