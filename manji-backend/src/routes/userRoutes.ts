import { Router, Request } from 'express';
import { createUserWithPassword, verifyUserPassword, createWechatUser, updateUserInfo } from '../services/userService';
import { getTotalWordCount } from '../services/noteService';
import { success, fail, serverError } from '../utils/response';

const router = Router();

// 1. 普通用户注册（带密码）
router.post('/register', async (req: Request, res) => {
    try {
        const { username, password, intro = '', avatar = '' } = req.body;
        // 校验参数
        if (!username || !password) {
            return fail(res, '用户名和密码不能为空');
        }
        // 调用 Service 方法创建用户
        const user = await createUserWithPassword(username, password, intro, avatar);
        // 隐藏密码哈希，只返回必要信息
        const userInfo = {
            id: user.id,
            username: user.username,
            avatar: user.avatar,
            intro: user.intro,
        };
        success(res, userInfo, '注册成功');
    } catch (error) {
        // 捕获唯一约束错误（如用户名重复）
        if ((error as any).name === 'SequelizeUniqueConstraintError') {
            return fail(res, '用户名已存在');
        }
        serverError(res, error);
    }
});

// 2. 用户登录（验证密码）
router.post('/login', async (req: Request, res) => {
    console.log('=== 匹配到修改笔记接口 ===');
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return fail(res, '用户名和密码不能为空');
        }
        // 调用 Service 验证密码
        const user = await verifyUserPassword(username, password);
        if (!user) {
            return fail(res, '用户名或密码错误');
        }
        const userInfo = {
            id: user.id,
            username: user.username,
            avatar: user.avatar,
            intro: user.intro,
        };
        success(res, userInfo, '登录成功');
    } catch (error) {
        serverError(res, error);
    }
});

// 3. 微信用户注册/登录（带 OpenID）
router.post('/wechat/login', async (req: Request, res) => {
    try {
        const { username, wechatOpenid, avatar = '', intro = '' } = req.body;
        if (!username || !wechatOpenid) {
            return fail(res, '用户名和微信 OpenID 不能为空');
        }
        // 调用 Service 创建/获取微信用户
        const user = await createWechatUser(username, wechatOpenid, avatar, intro);
        const userInfo = {
            id: user.id,
            username: user.username,
            avatar: user.avatar,
            intro: user.intro,
        };
        success(res, userInfo, '微信登录成功');
    } catch (error) {
        serverError(res, error);
    }
});

//统计用户所记录的总字数
router.get('/word-count/:userId', async (req: Request, res) => {
    try {
        const { userId } = req.params;  
        if (!userId) {
            return fail(res, '用户ID不能为空');
        }
        const totalWordCount = await getTotalWordCount(Number(userId));
        success(res, { totalWordCount }, '统计字数成功');
    }
    catch (error) {
        serverError(res, error);
    }
});

// 4. 修改用户信息（用户名和个性签名）
router.put('/:userId', async (req: Request, res) => {
    try {
        const { userId } = req.params;
        const { username, intro } = req.body;

        // 基础校验
        if (!userId) {
            return fail(res, '用户ID不能为空');
        }

        // 至少需要传入一个要更新的字段
        if (username === undefined && intro === undefined) {
            return fail(res, '至少需要传入一个要更新的字段（username 或 intro）');
        }

        // 构建更新数据
        const updateData: { username?: string; intro?: string } = {};
        if (username !== undefined) {
            updateData.username = username;
        }
        if (intro !== undefined) {
            updateData.intro = intro;
        }

        // 调用更新方法
        const updatedUser = await updateUserInfo(Number(userId), updateData);
        
        // 返回更新后的用户信息（隐藏敏感信息）
        const userInfo = {
            id: updatedUser.id,
            username: updatedUser.username,
            avatar: updatedUser.avatar,
            intro: updatedUser.intro,
        };
        
        success(res, userInfo, '修改个人信息成功');
    } catch (error) {
        // 捕获自定义错误，返回友好提示
        if ((error as any).message === '用户不存在') {
            return fail(res, (error as any).message);
        }
        // 捕获唯一约束错误（如用户名重复）
        if ((error as any).name === 'SequelizeUniqueConstraintError') {
            return fail(res, '用户名已存在');
        }
        serverError(res, error);
    }
});

export default router;