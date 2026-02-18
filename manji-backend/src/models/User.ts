import { DataTypes, Model } from 'sequelize';
import sequelize from '../db';

class User extends Model {
    public id!: number;
    public username!: string;
    public avatar!: string;
    public intro!: string;
    // 新增字段
    public passwordHash!: string | null; // 密码哈希（可为空）
    public wechatOpenid!: string | null; // 微信 OpenID（可为空）
    public readonly createTime!: Date;
}

User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        username: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        avatar: {
            type: DataTypes.STRING(255),
            defaultValue: '',
        },
        intro: {
            type: DataTypes.STRING(200),
            defaultValue: '',
        },
        // 新增字段配置
        passwordHash: {
            type: DataTypes.STRING(255),
            field: 'password_hash', // 对应数据库的下划线字段
            allowNull: true, // 允许为空（微信用户无需密码）
        },
        wechatOpenid: {
            type: DataTypes.STRING(64),
            field: 'wechat_openid',
            allowNull: true,
            unique: true, // 对应数据库的 UNIQUE 约束
        },
        createTime: {
            type: DataTypes.DATE,
            field: 'create_time',
            defaultValue: DataTypes.NOW,
        },
    },
    {
        sequelize,
        tableName: 'users',
        timestamps: false,
    }
);

export default User;