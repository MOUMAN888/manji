import Category from '../models/Category';

// 1. 创建分类
export async function createCategory(userId: number, name: string) {
  // 先校验分类名是否已存在（避免重复创建）
  const existingCategory = await Category.findOne({
    where: { userId, name }
  });
  if (existingCategory) {
    throw new Error(`分类「${name}」已存在`);
  }
  // 创建新分类
  return Category.create({
    userId,
    name
  });
}

// 2. 查询用户所有分类
export async function getCategoriesByUserId(userId: number) {
  return Category.findAll({
    where: { userId },
    order: [['createTime', 'DESC']] // 按创建时间倒序
  });
}

// 3. 修改分类名称
export async function updateCategoryName(categoryId: number, newName: string) {
  // 先校验分类是否存在
  const category = await Category.findByPk(categoryId);
  if (!category) {
    throw new Error('分类不存在');
  }
  // 校验新名称是否重复（同用户下）
  const existingCategory = await Category.findOne({
    where: { 
      userId: category.userId,
      name: newName 
    }
  });
  if (existingCategory && existingCategory.id !== categoryId) {
    throw new Error(`分类「${newName}」已存在`);
  }
  // 更新分类名
  return category.update({ name: newName });
}

// 4. 删除分类（会自动删除关联的笔记，因为数据库设置了 ON DELETE CASCADE）
export async function deleteCategory(categoryId: number) {
  const category = await Category.findByPk(categoryId);
  if (!category) {
    throw new Error('分类不存在');
  }
  return category.destroy();
}

// 5. 查询单个分类详情
export async function getCategoryById(categoryId: number) {
  return Category.findByPk(categoryId);
}