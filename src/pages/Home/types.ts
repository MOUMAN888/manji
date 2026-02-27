// 核心原则：
// 1. ID 统一为 number 类型（和后端 MySQL 的自增ID对齐，避免类型转换）
// 2. 字段命名与后端/前端使用习惯统一（驼峰命名）
// 3. 补充可选字段、默认值、注释，适配实际业务场景
// 4. 对齐后端返回的时间格式、字数统计逻辑

/**
 * 摘抄/灵感记录（对应后端 notes 表）
 */
export interface Article {
    id: number;                // 唯一ID（后端MySQL自增ID，数字类型）
    content: string;           // 摘抄或灵感的全文
    title: string;             // 笔记标题（补充：后端有title字段，前端需对应）
    categoryId: number;        // 所属分类的ID（数字类型，和后端category表ID对齐）
    userId: number;            // 所属用户ID（补充：关联用户，适配多用户场景）
    createTime: string;         // ISO日期字符串 (如: 2026-01-11T12:00:00.000Z)，用于日历索引
    updateTime: string;        // 可选：最后修改时间（后端有update_time字段）
    wordCount: number;         // 这一条记录的字数（后端自动计算）
}

/**
 * 分类（对应后端 categories 表）
 */
export interface Category {
    id: number;                // 分类ID（数字类型，和后端对齐）
    name: string;              // 分类名称 (如: 读书心得)
    userId: number;            // 所属用户ID（补充：避免不同用户分类冲突）
    createdAt?: string;        // 可选：分类创建时间（用于排序）
}

/**
 * 用户个人信息（对应后端 users 表）
 */
export interface UserProfile {
    id: number;                // 用户ID（核心字段，关联所有数据）
    username: string;              // 用户名（对应后端username）
    avatar: string;            // 头像地址（后端默认空字符串）
    bio: string;               // 个人简介（对应后端intro）
    intro?: string;            // 兼容：后端字段名为 intro
    passwordHash?: string;     // 可选：密码哈希（前端仅存储，不展示）
    wechatOpenid?: string;     // 可选：微信OpenID（适配后续微信登录）
    // 总字数不存储，通过 Article 列表计算得出：
    // totalWords: number; // 计算方式：articles.reduce((sum, item) => sum + item.wordCount, 0)
}

// 额外补充：常用的请求参数类型（前端调用接口时用）
/**
 * 创建/编辑Article的请求参数
 */
export interface Article {
    title: string;
    content: string;
    categoryId: number;
    userId: number;
    updateTime: string;
    wordCount: number;
}

/**
 * 创建/编辑Category的请求参数
 */
export interface Category {
    id: number;
    name: string;
    userId: number;
    createTime?: string;
}

/**
 * 用户登录/注册参数
 */
export interface UserForm {
    username: string;
    password: string;
    avatar?: string;
    bio?: string;
}

/**
 * 微信登录参数
 */
export interface WechatLoginForm {
    username: string;
    wechatOpenid: string;
    avatar?: string;
    bio?: string;
}

export interface totalWords {
    totalWordCount: number;
}
export type Mode = 'read' | 'edit';
