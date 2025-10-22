import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import RecruitmentNews from './RecruitmentNews.js';
import PersonalUser from './PersonalUser.js';

class NewsMarks extends Model {}

NewsMarks.init({
    recruitmentNewsId: {
        type: DataTypes.INTEGER,
        references: {
            model: RecruitmentNews,
            key: 'id',
        },
        allowNull: false,
        primaryKey: true
    },
    personalId: {
        type: DataTypes.INTEGER,
        references: {
            model: PersonalUser,
            key: 'userId',
        },
        allowNull: false,
        primaryKey: true
    }
}, {
    sequelize,
    modelName: 'NewsMarks',
    tableName: 'News_Marks', 
    timestamps: false, 
});

export default NewsMarks;