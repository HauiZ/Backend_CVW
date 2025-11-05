import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import PersonalUser from './PersonalUser.js';
import RecruitmentNews from './RecruitmentNews.js';

class UserJobRating extends Model { }

UserJobRating.init({
  user_id: {
    type: DataTypes.STRING(64), primaryKey: true, references: {
      model: PersonalUser,
      key: 'userId',
    },
  },
  job_id: {
    type: DataTypes.STRING(64), primaryKey: true, references: {
      model: RecruitmentNews,
      key: 'id',
    },
  },
  view_count: { type: DataTypes.INTEGER, allowNull: false },
  save_count: { type: DataTypes.INTEGER, allowNull: false },
  apply_count: { type: DataTypes.INTEGER, allowNull: false },
  rating: { type: DataTypes.FLOAT, allowNull: false },
  last_aggregated_ts: { type: DataTypes.DATE }
}, {
  sequelize,
  modelName: 'UserJobRating',
  tableName: 'UserJobRating',
  timestamps: false,
});

export default UserJobRating;
