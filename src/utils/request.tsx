import axios from 'axios';
import { message } from 'antd';
import type { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

// 后端接口基础地址（根据实际部署地址修改）
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

// 后端统一响应格式（和后端 utils/response.ts 对应）
export interface ApiResponse<T> {
    code: number;
    message: string;
    data?: T;
}

// 创建 Axios 实例
const request: AxiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 10000, // 请求超时时间
    headers: {
        'Content-Type': 'application/json;charset=UTF-8',
    },
});

// 请求拦截器：添加 token（后续登录功能用）、处理请求前逻辑
request.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('userToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

request.interceptors.response.use(
    (response: AxiosResponse<ApiResponse<any>>) => {
        const res = response.data;

        if (res.code === 200) {
            // ⭐ 只把真正的数据返回
            return res.data;
        }

        message.error(res.message);
        throw new Error(res.message);
    },
    (error) => {
        const errMsg = error.response?.data?.message || '网络异常，请稍后重试';
        message.error(errMsg);
        throw new Error(errMsg);
    }
);

export default request;