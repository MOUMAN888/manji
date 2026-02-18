import User from '../models/User';
import bcrypt from 'bcryptjs'; 

// 1. 创建普通用户（带密码）
export async function createUserWithPassword(
    username: string,
    password: string,
    intro: string = '',
    avatar: string = ''
) {
    // 密码哈希（避免明文存储）
    const passwordHash = bcrypt.hashSync(password, 10); // 10 是加盐强度
    return User.create({
        username,
        avatar,
        intro,
        passwordHash, // 存储哈希值
        wechatOpenid: null, // 普通用户无 OpenID
    });
}

// 2. 创建微信用户（带 OpenID，无密码）
export async function createWechatUser(
    username: string,
    wechatOpenid: string,
    avatar: string = '',
    intro: string = ''
) {
    // 先检查 OpenID 是否已存在
    const existingUser = await User.findOne({ where: { wechatOpenid } });
    if (existingUser) {
        return existingUser; // 已存在则返回原用户
    }
    return User.create({
        username,
        avatar,
        intro,
        passwordHash: null, // 微信用户无密码
        wechatOpenid,
    });
}

// 3. 验证用户密码（登录时用）
export async function verifyUserPassword(username: string, password: string) {
    const user = await User.findOne({ where: { username } });
    if (!user || !user.passwordHash) {
        return null; // 用户不存在或无密码（微信用户）
    }
    // 验证密码哈希
    const isPasswordValid = bcrypt.compareSync(password, user.passwordHash);
    return isPasswordValid ? user : null;
}

// 4. 修改用户密码
export async function updateUserPassword(userId: number, newPassword: string) {
    const passwordHash = bcrypt.hashSync(newPassword, 10);
    return User.update(
        { passwordHash },
        { where: { id: userId } }
    );
}

// 5. 修改用户信息（用户名和个性签名）
export async function updateUserInfo(
    userId: number,
    updateData: {
        username?: string;
        intro?: string;
    }
) {
    // 先校验用户是否存在
    const user = await User.findByPk(userId);
    if (!user) {
        throw new Error('用户不存在');
    }

    // 构建更新数据（只更新传入的字段）
    const updatePayload: { username?: string; intro?: string } = {};
    if (updateData.username !== undefined) {
        updatePayload.username = updateData.username;
    }
    if (updateData.intro !== undefined) {
        updatePayload.intro = updateData.intro;
    }

    // 执行更新
    await user.update(updatePayload);
    return user;
}