import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import User from './User.js';
import Area from './Area.js';
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
        type: DataTypes.STRING,
        allowNull: true,
    },
    website: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    introduction: {
        type: DataTypes.TEXT,
        allowNull: true,
        get() {
            const value = this.getDataValue('introduction');
            return value ? JSON.parse(value) : null;
        },
        set(value) {
            this.setDataValue('introduction', JSON.stringify(value));
        }
    },
    logoId: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    sequelize,
    modelName: 'CompanyUser',
    tableName: 'Company_User',
    timestamps: false,
});


export default CompanyUser;