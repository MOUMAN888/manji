import { Router, Request } from 'express';
import { createCategory, getCategoriesByUserId, updateCategoryName, deleteCategory } from '../services/categoryService';
import { success, fail, serverError } from '../utils/response';

const router = Router();

// 1. 创建分类
router.post('/', async (req: Request, res) => {
    try {
        const { userId, name } = req.body;
        if (!userId || !name) {
            return fail(res, '用户ID和分类名不能为空');
        }
        const category = await createCategory(userId, name);
        success(res, category, '分类创建成功');
    } catch (error) {
        serverError(res, error);
    }
});

// 2. 查询用户所有分类
router.get('/:userId', async (req: Request, res) => {
    try {
        const { userId } = req.params;
        if (!userId) {
            return fail(res, '用户ID不能为空');
        }
        const categories = await getCategoriesByUserId(Number(userId));
        success(res, categories, '查询分类成功');
    } catch (error) {
        serverError(res, error);
    }
});

router.put('/:categoryId', async (req: Request, res) => {
    // 修改分类名称
    try {
        const { categoryId } = req.params;
        const { newName } = req.body;
        if (!categoryId || !newName
        ) {
            return fail(res, '分类ID和新名称不能为空');
        }
        const updatedCategory = await updateCategoryName(Number(categoryId), newName);
        success(res, updatedCategory, '分类名称更新成功');
    } catch (error) {
        serverError(res, error);
    }
}
);

// 4. 删除分类
router.delete('/:categoryId', async (req: Request, res) => {
    try {
        const { categoryId } = req.params;
        if (!categoryId) {
            return fail(res, '分类ID不能为空');
        }
        await deleteCategory(Number(categoryId));
        success(res, null, '分类删除成功');
    } catch (error) {
        serverError(res, error);
    }
});

export default router;