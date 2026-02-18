import { DataTypes, Model } from 'sequelize';
import sequelize from '../db';
import User from './User';

class Category extends Model {
    public id!: number;
    public userId!: number;
    public name!: string;
    public readonly createTime!: Date;
}

Category.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        userId: {
            type: DataTypes.INTEGER,
            field: 'user_id',
            allowNull: false,
            references: {
                model: User,
                key: 'id',
            },
        },
        name: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        createTime: {
            type: DataTypes.DATE,
            field: 'create_time',
            defaultValue: DataTypes.NOW,
        },
    },
    {
        sequelize,
        tableName: 'categories',
        timestamps: false,
    }
);

// 关联用户（Category 属于 User）
Category.belongsTo(User, { foreignKey: 'userId' });

export default Category;