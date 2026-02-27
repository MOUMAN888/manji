import request from '../utils/request';
import type {Article} from '../pages/Home/types';

// 字数统计结果类型
export interface WordCountResult {
    totalWordCount: number;
}

// 创建笔记
export const createNote = (params: {
    userId: number;
    categoryId: number;
    title: string;
    content: string;
}) => {
    const res =  request.post<Article>('/notes', params);
    return res as unknown as Article;
};

// 按分类查询笔记
export const getNotesByCategory = async (params: {
    categoryId: number;
    userId: number;
}) => {
    const res = await request.get<Article[]>(`/notes/category/${params.categoryId}/user/${params.userId}`);
    return res as unknown as Article[];
};

// 获取用户所有笔记
export const getNotesByUser = async (userId: number) => {
    const res = await request.get<Article[]>(`/notes/user/${userId}`);
    return res as unknown as Article[];
};

// 搜索笔记（按标题 / 内容模糊匹配）
export const searchNotes = async (params: { userId: number; keyword: string }) => {
    const res = await request.get<Article[]>(`/notes/search`, {
        params: {
            userId: params.userId,
            keyword: params.keyword,
        },
    });
    return res as unknown as Article[];
};

// 统计用户总字数
export const getTotalWordCount = (userId: number) => {
    return request.get<WordCountResult>(`/notes/word-count/${userId}`);
};

// 修改笔记
export const updateNote = (noteId: number, params: {
    userId: number;
    categoryId?: number;
    title?: string;
    content?: string;
}) => {
    return request.put<Article>(`/notes/${noteId}`, params);
};

// 获取活跃笔记日期
export const getActiveNoteDays = async (params: {
    userId: number;
    yearMonth: string;
}) => {
    const res = await request.get<string[]>(`/notes/active-days`, {
        params: {
            userId: params.userId,
            yearMonth: params.yearMonth,
        },
    });
    return res as unknown as string[];
};

// 按日期查询笔记
export const getNotesByDate = async (params: {
    userId: number;
    date: string;
}) => {
    const res = await request.get<Article[]>(`/notes/by-date`, {
        params: {
            userId: params.userId,
            date: params.date,
        },
    });
    return res as unknown as Article[];
}

// 删除笔记
export const deleteNote = (noteId: number) => {
    return request.delete(`/notes/${noteId}`);
};
