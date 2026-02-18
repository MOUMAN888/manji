import express from 'express';
import sequelize from './db'; // 引入你的数据库配置文件
import cors from 'cors';
// 引入你的路由（根据实际路径调整）
import userRoutes from './routes/userRoutes';
import noteRoutes from './routes/noteRoutes';
import categoryRoutes from './routes/categoryRoutes';

const app = express();
const PORT = Number(process.env.PORT) || 3002;

const corsOptions: cors.CorsOptions = {
  // 开发环境允许所有来源，生产环境建议替换为具体域名
  origin: '*', 
  // 允许的请求方法（覆盖预检请求的 Method 检查）
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  // 允许的请求头（解决自定义头的跨域问题）
  allowedHeaders: ['Content-Type', 'Authorization'],
  // 允许携带 Cookie/凭证（如果你的业务需要的话）
  credentials: false,
  // 预检请求的缓存时间（减少 OPTIONS 请求次数）
  maxAge: 86400
};

// 应用 CORS 配置
app.use(cors(corsOptions));
// 显式处理所有 OPTIONS 预检请求（确保不会被其他中间件拦截）
app.options('*', cors(corsOptions));

// 基础中间件（必须加，否则无法解析JSON请求）
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 挂载路由
app.use('/api/users', userRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/categories', categoryRoutes);

// 核心：先完成数据库连接+表同步，再启动服务
async function startServer() {
  try {
    // 1. 验证数据库连接（强制等待连接完成）
    await sequelize.authenticate();
    console.log('✅ MySQL 连接成功！');

    // 2. 同步数据库表（force: false 不删除已有表，首次部署可设为true）
    await sequelize.sync({ force: false });
    console.log('✅ 数据库表同步成功！');

    // 3. 启动HTTP服务（只有数据库准备好才启动）
    const server = app.listen(PORT, () => {
      console.log(`✅ 后端服务运行在 http://localhost:${PORT}`);
    });
    server.on('error', (err: any) => {
      if (err?.code === 'EADDRINUSE') {
        console.error(`❌ 端口 ${PORT} 已被占用。请释放端口或更换端口：\n- Windows: netstat -ano | findstr :${PORT} && taskkill /PID <PID> /F\n- 临时换端口: set PORT=3003 && npm run dev`);
        process.exit(1);
      }
      console.error('❌ Server error:', err);
      process.exit(1);
    });
  } catch (error) {
    // 捕获数据库/启动错误，避免服务静默崩溃
    console.error('❌ 服务启动失败：', error);
    // 退出进程，让PM2感知错误（可选）
    process.exit(1);
  }
}

// 执行启动函数
startServer();