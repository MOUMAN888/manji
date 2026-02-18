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

// //统计用户总字数
// export const getUserTotalWordCount = (userId: number): Promise<totalWords> => {
//     return request.get<totalWords>(`/users/word-count/${userId}`).then(res => res); // 直接返回 res.data
// }
