import { Response } from 'express';

// 统一响应格式
export interface ApiResponse<T= any> {
    code: number;       // 状态码：200成功/400参数错误/500服务器错误
    message: string;    // 提示信息
    data?: T;           // 响应数据（可选）
}

// 成功响应
export const success = <T>(res: Response, data?: T, message = '操作成功') => {
    const response: ApiResponse<T> = {
        code: 200,
        message,
        data,
    };
    res.json(response);
};

// 失败响应
export const fail = (res: Response, message = '操作失败', code = 400) => {
    const response: ApiResponse = {
        code,
        message,
    };
    res.json(response);
};

// 服务器错误响应
export const serverError = (res: Response, error: any, message = '服务器内部错误') => {
    console.error('服务器错误：', error); // 打印错误日志
    const response: ApiResponse = {
        code: 500,
        message,
    };
    res.status(500).json(response);
};