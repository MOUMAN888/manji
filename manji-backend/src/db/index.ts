import { Sequelize } from 'sequelize';

// 连接本地 MySQL（替换为你的密码）
const sequelize = new Sequelize('note_db', 'note_user', '123456', {
    host: 'localhost', // 本地连接用 localhost
    port: 3306,
    dialect: 'mysql',
    dialectOptions: {
        charset: 'utf8mb4',
    },
    logging: false, // 关闭 SQL 日志（生产建议开启）
});

// 测试连接
async function testConnection() {
    try {
        await sequelize.authenticate();
        console.log('MySQL 连接成功！');
    } catch (err) {
        console.error('MySQL 连接失败：', err);
    }
}
testConnection();

export default sequelize;