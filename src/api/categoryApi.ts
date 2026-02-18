import request from '../utils/request';

// 分类类型
export interface Category {
    id: number;
    userId: number;
    name: string;
    createTime: string;
}

// 创建分类
export const createCategory = (params: { userId: number; name: string }) => {
    return request.post<Category>('/categories', params);
};

// 查询用户所有分类
export const getCategoriesByUserId = async (userId: number): Promise<Category[]> => {
    const res = await request.get<Category[]>(`/categories/${userId}`);
    return res as unknown as Category[];
};

// 修改分类名称
export const updateCategoryName = (params: {
    categoryId: number;
    newName: string;
}) => {
    return request.put(`/categories/${params.categoryId}`, { newName: params.newName });
};

// 删除分类
export const deleteCategory = (categoryId: number) => {
    return request.delete(`/categories/${categoryId}`);
};