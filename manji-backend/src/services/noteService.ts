import User from "../models/User";
import Category from "../models/Category";
import { Op, fn, col, where  } from "sequelize";
import dayjs from "dayjs";
import Note from "../models/Note";



// 1. 初始化默认用户（第一次使用时调用）
export async function initDefaultUser() {
    const [user] = await User.findOrCreate({
        where: { username: "林小墨" }, // 替换为你的默认用户名
        defaults: {
            avatar: "",
            intro: "喜欢读书和记录灵感",
        },
    });
    return user;
}

// 2. 创建分类
export async function createCategory(userId: number, name: string) {
    return Category.create({
        userId,
        name,
    });
}

// 3. 创建笔记（自动计算字数）
export async function createNote(
    userId: number,
    categoryId: number,
    title: string,
    content: string,
) {
    // 计算字数（过滤空格和换行）
    const wordCount = content.replace(/\s+/g, "").length;
    return Note.create({
        userId,
        categoryId,
        title,
        content,
        wordCount,
    });
}

// . 统计总字数
export async function getTotalWordCount(userId: number) {
    const result = await Note.sum("wordCount", { where: { userId } });
    return result || 0;
}

// 5. 按分类查询笔记（如果没有传categoryId，则返回所有笔记）
export async function getNotesByCategory(userId: number, categoryId?: number) {
    const whereCondition: { userId: number; categoryId?: number } = { userId };
    if (categoryId !== undefined) {
        whereCondition.categoryId = categoryId;
    }
    const notes = await Note.findAll({
        where: whereCondition,
        include: [
            {
                model: Category,
                attributes: ['id', 'name'],
            },
        ],
        order: [["createTime", "DESC"]],
    });

    // 扁平化分类名称：直接返回 categoryName（更方便前端使用）
    return notes.map((n: any) => {
        const json = n.toJSON ? n.toJSON() : n;
        return {
            ...json,
            categoryName: json?.Category?.name ?? null,
            Category: undefined,
        };
    });
}

// 6. 查询用户笔记数量
export async function getNoteCount(userId: number): Promise<number> {
    return Note.count({ where: { userId } });
}

// 7. 搜索笔记（按标题和内容模糊匹配）
export async function searchNotes(
    userId: number,
    keyword: string
) {
    const whereCondition: any = {
        userId,
        [Op.or]: [
            { title: { [Op.like]: `%${keyword}%` } },
            { content: { [Op.like]: `%${keyword}%` } },
        ],
    };

    const notes = await Note.findAll({
        where: whereCondition,
        include: [
            {
                model: Category,
                attributes: ['id', 'name'],
            },
        ],
        order: [["createTime", "DESC"]],
    });

    // 扁平化分类名称：直接返回 categoryName
    return notes.map((n: any) => {
        const json = n.toJSON ? n.toJSON() : n;
        return {
            ...json,
            categoryName: json?.Category?.name ?? null,
            Category: undefined,
        };
    });
}
export async function updateNote(
    noteId: number,
    userId: number,
    updateData: {
        categoryId?: number;
        title?: string;
        content?: string;
    },
) {
    // 1. 先校验笔记是否存在且属于当前用户
    const note = await Note.findOne({
        where: { id: noteId, userId },
    });

    if (!note) {
        throw new Error("笔记不存在或无权限修改");
    }

    // 2. 如果更新了内容，重新计算字数
    const updatePayload: { categoryId?: number; title?: string; content?: string; wordCount?: number } = { ...updateData };
    if (updateData.content) {
        updatePayload.wordCount = updateData.content.replace(/\s+/g, "").length;
    }

    // 3. 执行更新
    await note.update(updatePayload);
}


interface ActiveDayRow {
    date: string;
}

export async function getActiveNoteDays(
    userId: number,
    yearMonth: string
): Promise<string[]> {
    // 解析年月
    const [year, month] = yearMonth.split('-').map(Number);

    // 使用「左闭右开」区间，避免毫秒 & 边界问题
    const start = new Date(year, month - 1, 1, 0, 0, 0);
    const end = new Date(year, month, 1, 0, 0, 0);

    const result = await Note.findAll({
        where: {
            userId,
            createTime: {
                [Op.gte]: start,
                [Op.lt]: end,
            },
        },
        attributes: [
            // ⚠️ 一定要用 表名 + 数据库字段
            [fn('DATE', col('Note.create_time')), 'date'],
        ],
        group: [fn('DATE', col('Note.create_time'))],
        order: [[fn('DATE', col('Note.create_time')), 'ASC']],
        raw: true,
    });

    // 统一格式，防止不同数据库返回类型不一致
    return (result as unknown as ActiveDayRow[]).map(item =>
        dayjs(item.date).format('YYYY-MM-DD')
    );
}

// 根据日期查询当天的笔记
export async function getNotesByDate(
    userId: number,
    date: string // YYYY-MM-DD
) {
    // 校验日期格式
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
        throw new Error('date 格式错误，必须为 YYYY-MM-DD');
    }

    const notes = await Note.findAll({
        where: {
            userId,
            // ✅ 等价于：DATE(create_time) = '2026-01-23'
            [Op.and]: where(
                fn('DATE', col('Note.create_time')),
                date
            ),
        },
        include: [
            {
                model: Category,
                attributes: ['id', 'name'],
            },
        ],
        order: [[col('Note.create_time'), 'DESC']],
    });

    // 扁平化分类名称：直接返回 categoryName（更方便前端使用）
    return notes.map((n: any) => {
        const json = n.toJSON ? n.toJSON() : n;
        return {
            ...json,
            categoryName: json?.Category?.name ?? null,
            Category: undefined,
        };
    });
}

export async function deleteNote(noteId: number) {
    // 1. 先校验笔记是否存在且属于当前用户
    const note = await Note.findByPk(noteId);
    if (!note) {
        throw new Error("笔记不存在或无权限删除");
    }
    // 2. 删除笔记
    return note.destroy();
}