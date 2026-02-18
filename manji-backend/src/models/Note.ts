import { DataTypes, Model } from 'sequelize';
import sequelize from '../db';
import User from './User';
import Category from './Category';

class Note extends Model {
    public id!: number;
    public userId!: number;
    public categoryId!: number;
    public title!: string;
    public content!: string;
    public wordCount!: number;
    public readonly createTime!: Date;
    public readonly updateTime!: Date;
}

Note.init(
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
        categoryId: {
            type: DataTypes.INTEGER,
            field: 'category_id',
            allowNull: false,
            references: {
                model: Category,
                key: 'id',
            },
        },
        title: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        wordCount: {
            type: DataTypes.INTEGER,
            field: 'word_count',
            allowNull: false,
        },
        createTime: {
            type: DataTypes.DATE,
            field: 'create_time',
            defaultValue: DataTypes.NOW,
        },
        updateTime: {
            type: DataTypes.DATE,
            field: 'update_time',
            defaultValue: DataTypes.NOW,
        },
    },
    {
        sequelize,
        tableName: 'notes',
        timestamps: false,
    }
);

// 关联用户和分类
Note.belongsTo(User, { foreignKey: 'userId' });
Note.belongsTo(Category, { foreignKey: 'categoryId' });

export default Note;