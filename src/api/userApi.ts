import request from '../utils/request';

// 用户信息类型
export interface UserInfo {
    id: number;
    username: string;
    avatar: string;
    intro: string;
}

export interface totalWords {
    totalWordCount: number;
}

// 修改用户信息（用户名/简介）
export const updateUserInfo = async (
    userId: number,
    params: { username?: string; intro?: string }
): Promise<UserInfo> => {
    const res = await request.put<UserInfo>(`/users/${userId}`, params);
    return res as unknown as UserInfo;
};

// 注册
export const register = (params: {
    username: string;
    password: string;
    intro?: string;
    avatar?: string;
}) => {
    return request.post<UserInfo>('/users/register', params);
};

// 登录
export const login = (params: {
    username: string;
    password: string;
}) => {
    return request.post<UserInfo>('/users/login', params);
};

// 统计用户总字数
export const getUserTotalWordCount = async (userId: number): Promise<totalWords> => {
    const res = await request.get<totalWords>(`/users/word-count/${userId}`);
    return res as unknown as totalWords;
};
