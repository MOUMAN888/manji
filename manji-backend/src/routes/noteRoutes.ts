import { Router, Request } from 'express';
import { createNote, getNotesByCategory, getTotalWordCount, updateNote, getActiveNoteDays, getNotesByDate, deleteNote, getNoteCount, searchNotes } from '../services/noteService';
import { success, fail, serverError } from '../utils/response';

const router = Router();

// 1. 创建笔记（自动计算字数）
router.post('/', async (req: Request, res) => {
    console.log('=== 匹配到修改创建接口 ===');
    try {
        const { userId, categoryId, title, content } = req.body;
        if (!userId || !categoryId || !title || !content) {
            return fail(res, '用户ID、分类ID、标题、内容不能为空');
        }
        const note = await createNote(Number(userId), Number(categoryId), title, content);
        success(res, note, '笔记创建成功');
    } catch (error) {
        serverError(res, error);
    }
});

// 2. 获取用户所有笔记
router.get('/user/:userId', async (req: Request, res) => {
    try {
        const { userId } = req.params;
        if (!userId) {
            return fail(res, '用户ID不能为空');
        }
        const notes = await getNotesByCategory(Number(userId));
        success(res, notes, '查询笔记成功');
    } catch (error) {
        serverError(res, error);
    }
});

// 3. 按分类查询笔记
router.get('/category/:categoryId/user/:userId', async (req: Request, res) => {
    try {
        const { categoryId, userId } = req.params;
        if (!categoryId || !userId) {
            return fail(res, '分类ID和用户ID不能为空');
        }
        const notes = await getNotesByCategory(Number(userId), Number(categoryId));
        success(res, notes, '查询笔记成功');
    } catch (error) {
        serverError(res, error);
    }
});

// 4. 统计用户总字数
router.get('/word-count/:userId', async (req: Request, res) => {
    try {
        const { userId } = req.params;
        if (!userId) {
            return fail(res, '用户ID不能为空');
        }
        const totalWordCount = await getTotalWordCount(Number(userId));
        success(res, { totalWordCount }, '统计字数成功');
    } catch (error) {
        serverError(res, error);
    }
});

// 5. 统计用户笔记数量
router.get('/count/:userId', async (req: Request, res) => {
    try {
        const { userId } = req.params;
        if (!userId) {
            return fail(res, '用户ID不能为空');
        }
        const noteCount = await getNoteCount(Number(userId));
        success(res, { noteCount }, '统计笔记数量成功');
    } catch (error) {
        serverError(res, error);
    }
});

// 6. 修改笔记（新增接口）
router.put('/:noteId', async (req: Request, res) => {
    console.log('=== 匹配到修改笔记接口 ===');
    try {
        const { noteId } = req.params;
        const { userId, categoryId, title, content } = req.body;

        // 基础校验
        if (!noteId || !userId) {
            return fail(res, '笔记ID和用户ID不能为空');
        }

        // 构建更新数据（只更新传了的字段）
        const updateData: { categoryId?: number; title?: string; content?: string } = {};
        if (categoryId !== undefined) updateData.categoryId = Number(categoryId);
        if (title !== undefined) updateData.title = title;
        if (content !== undefined) updateData.content = content;

        // 调用更新方法
        const updatedNote = await updateNote(Number(noteId), Number(userId), updateData);
        success(res, updatedNote, '笔记修改成功');
    } catch (error) {
        // 捕获自定义错误，返回友好提示
        if (error.message === '笔记不存在或无权限修改') {
            return fail(res, error.message);
        }
        serverError(res, error);
    }
});

router.get('/active-days', async (req, res) => {
    console.log('=== 匹配到查询活跃笔记天数接口 ===');
    try {
        const { userId, yearMonth } = req.query;

        // 1. 基础参数校验
        if (!userId || !yearMonth) {
            return fail(res, 'userId、yearMonth 不能为空');
        }
        // 2. 校验年月格式（YYYY-MM）
        const yearMonthRegex = /^\d{4}-\d{2}$/;
        if (!yearMonthRegex.test(String(yearMonth))) {
            return fail(res, 'yearMonth格式错误，必须为YYYY-MM（如：2026-01）');
        }
        // 3. 校验年月的合法性（比如不能是 2026-13 这种无效月份）
        const [year, month] = String(yearMonth).split('-').map(Number);
        if (month < 1 || month > 12 || year < 1970 || year > 2100) {
            return fail(res, 'yearMonth不合法，月份必须是1-12，年份范围1970-2100');
        }
        // 4. 调用查询函数
        const days = await getActiveNoteDays(
            Number(userId),
            String(yearMonth)
        );

        success(res, days , '查询成功');
    } catch (error) {
        console.error('查询活跃笔记天数失败：', error);
        serverError(res, error);
    }
});

// 6. 根据日期查询笔记
router.get('/by-date', async (req: Request, res) => {
    console.log('=== 匹配到按日期查询笔记接口 ===');
    try {
        const { userId, date } = req.query;

        // 1. 参数校验
        if (!userId || !date) {
            return fail(res, 'userId、date 不能为空');
        }

        // 2. 日期格式校验
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(String(date))) {
            return fail(res, 'date 格式错误，必须为 YYYY-MM-DD（如：2026-01-16）');
        }

        // 3. 调用 service
        const notes = await getNotesByDate(
            Number(userId),
            String(date)
        );

        success(res, notes, '查询当天笔记成功');
    } catch (error) {
        console.error('按日期查询笔记失败：', error);
        serverError(res, error);
    }
});

// 7. 删除笔记
router.delete('/:noteId', async (req: Request, res) => {
    try {
        const { noteId } = req.params;
        if (!noteId) {
            return fail(res, '笔记ID不能为空');
        }
        await deleteNote(Number(noteId));
        success(res, null, '笔记删除成功');
    } catch (error) {
        // 捕获自定义错误，返回友好提示
        if (error.message === '笔记不存在或无权限删除') {
            return fail(res, error.message);
        }
        serverError(res, error);
    }
});

// 8. 搜索笔记（按标题和内容模糊匹配）
router.get('/search', async (req: Request, res) => {
    try {
        const { userId, keyword } = req.query;

        if (!userId || !keyword) {
            return fail(res, 'userId、keyword 不能为空');
        }

        const notes = await searchNotes(Number(userId), String(keyword));
        success(res, notes, '搜索笔记成功');
    } catch (error) {
        console.error('搜索笔记失败：', error);
        serverError(res, error);
    }
});

export default router;