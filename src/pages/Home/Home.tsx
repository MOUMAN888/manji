import { useState, useMemo, useEffect, useRef } from 'react';
import type { Dayjs } from 'dayjs';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import styles from './Home.module.css';
import Calendar from './components/Calendar/Calendar';
import PaperEditor from './components/PaperEditor/PaperEditor';
import CategoryModel from './components/CategoryModel/CategoryModel';
// import { getUserTotalWordCount } from '../../api/userApi';
import { getCategoriesByUserId, deleteCategory, updateCategoryName } from '../../api/categoryApi';
import { getNotesByCategory, createNote, updateNote, getNotesByDate, deleteNote } from '../../api/noteApi';
import type { Article, Category, UserProfile, Mode } from './types';
import { Popconfirm, Modal, Input, message } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';

function Home() {
    const navigate = useNavigate();
    const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
    const [selectedArticleId, setSelectedArticleId] = useState<number | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [articles, setArticles] = useState<Article[]>([]);
    const [userInfo, setUserInfo] = useState<UserProfile | null>(null);
    const [isShowModal, setIsShowModal] = useState(false);
    const [currentDate, setCurrentDate] = useState<Dayjs>(dayjs());
    const [dateArticles, setDateArticles] = useState<Article[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);
    const [userId, setUserId] = useState<number>(-1);
    const [mode, setMode] = useState<Mode>('read');
    const [editingArticle, setEditingArticle] = useState<Article | null >(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [editCategoryName, setEditCategoryName] = useState('');
    // const [totalWords, setTotalWords] = useState<totalWords>({ totalWordCount: 0 });

    const handleLogout = () => {
        localStorage.removeItem('userInfo');
        navigate('/login');
        window.location.reload();
    }
    const handleSelectCategory = () => {
        if (categories.length === 0) return;

        // 如果当前没有选中分类，默认选第一个
        if (selectedCategoryId === null) {
            setSelectedCategoryId(categories[0].id);
        }
    }

    const handleEditCategoryClick = (cat: Category) => {
        setEditingCategory(cat);
        setEditCategoryName(cat.name);
        setIsEditModalOpen(true);
    };
    const handleUpdateCategory = async () => {
        if (!editingCategory) return;

        if (!editCategoryName.trim()) {
            message.warning('分类名不能为空');
            return;
        }

        try {
            await updateCategoryName({
                categoryId: editingCategory.id,
                newName: editCategoryName.trim(),
            });
            message.success('分类修改成功');
            setIsEditModalOpen(false);
            setEditingCategory(null);

            // 刷新分类列表
            refreshCategories();
        } catch (err) {
            console.error('修改分类失败：', err);
            message.error('修改分类失败');
        }
    };
    const handleCreateNew = () => {
        setMode('edit');
        setSelectedArticleId(null);
        setEditingArticle({
            id: 0,
            title: '',
            content: '',
            userId: userId ?? 0,
            categoryId: selectedCategoryId ?? 0,
            updateTime: new Date().toISOString(),
            createTime: new Date().toISOString(),
            wordCount: 0
        });
    };
    const handleEnterEdit = (article: Article) => {
        setMode('edit');
        setEditingArticle({ ...article });
    };
    const handleDateSelect = async (selectedDate: string) => {
        setCurrentDate(dayjs(selectedDate));
        console.log('日历选中的日期：', selectedDate);
        const res = await getNotesByDate({
            userId: userId!,
            date: selectedDate
        })
            .then(notes => {
                setDateArticles(notes);
                message.success('加载该日期笔记成功');
            })
            .catch(err => {
                console.error('获取选中日期笔记失败：', err);
                message.error('获取选中日期笔记失败');
            });
        console.log('Notes for selected date:', res);
    };
    const handleSave = async () => {
        if (!editingArticle || !userId) return;

        try {
            let savedArticleId: number;

            if (editingArticle.id === 0) {
                // ✅ 创建
                const res = await createNote({
                    userId,
                    categoryId: editingArticle.categoryId,
                    title: editingArticle.title,
                    content: editingArticle.content
                });
                // 假设后端返回 { id: number }
                console.log('创建笔记返回：', res);
                savedArticleId = res.id;;
            } else {
                // ✅ 更新
                await updateNote(editingArticle.id, {
                    userId,
                    categoryId: editingArticle.categoryId,
                    title: editingArticle.title,
                    content: editingArticle.content
                });

                savedArticleId = editingArticle.id;
            }

            // ✅ 重新拉文章列表
            if (selectedCategoryId) {
                const list = await getNotesByCategory({
                    categoryId: selectedCategoryId,
                    userId
                });
                setArticles(list);

                // ✅ 自动选中刚刚保存的文章
                setSelectedArticleId(savedArticleId);
            }

            setMode('read');
            setEditingArticle(null);
            message.success('保存成功');
        } catch (e) {
            console.error('保存失败', e);
            message.error('保存失败');
        }
    };


    const handleDeleteCategory = (id: number) => {
        deleteCategory(id).then(() => {
            // 删除后刷新分类列表
            refreshCategories();
        }).catch(() => {
            message.error('删除分类失败');
        });
    };

    const handleDeleteArticle = (id: number) => {
        deleteNote(id).then(async () => {
            // 删除后刷新文章列表
            if (selectedCategoryId) {
                const res = await getNotesByCategory({
                    categoryId: selectedCategoryId,
                    userId: userId!
                });
                setArticles(res);
            }
        }).catch(() => {
            message.error('删除笔记失败');
        });
    }

    const refreshCategories = async () => {
        if (userId) {
            const res = await getCategoriesByUserId(userId);
            setCategories(res);
        }
    };

    const startResize = (
        e: React.MouseEvent,
        type: 'sidebar' | 'middleColumn'
    ) => {
        e.preventDefault();

        const startX = e.clientX;
        const container = containerRef.current;
        if (!container) return;

        const styles = getComputedStyle(container);
        const startSidebarWidth = parseInt(styles.getPropertyValue('--sidebar-width'));
        const startMiddleWidth = parseInt(styles.getPropertyValue('--middle-width'));

        const onMouseMove = (moveEvent: MouseEvent) => {
            const delta = moveEvent.clientX - startX;

            if (type === 'sidebar') {
                const newWidth = Math.max(160, startSidebarWidth + delta);
                container.style.setProperty('--sidebar-width', `${newWidth}px`);
            }

            if (type === 'middleColumn') {
                const newWidth = Math.max(240, startMiddleWidth + delta);
                container.style.setProperty('--middle-width', `${newWidth}px`);
            }
        };

        const onMouseUp = () => {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    };
    const addCategory = () => {
        setIsShowModal(true);
        console.log('Add Category Clicked');
    }

    useEffect(() => {
        const userInfoStr = localStorage.getItem('userInfo');
        if (!userInfoStr) {
            message.error('未找到用户信息，请先登录');
            return;
        }

        try {
            const parsedUser: UserProfile = JSON.parse(userInfoStr);
            const validUser: UserProfile = {
                id: Number(parsedUser.id) || 0,
                username: parsedUser.username || parsedUser.username || 'Unknown User',
                avatar: parsedUser.avatar || '',
                bio: parsedUser.bio || 'No bio provided'
            };
            // 仅更新状态，无其他逻辑 → 消除同步更新警告
            setTimeout(() => {
            setUserInfo(validUser);
            }, 0);
        } catch (error) {
            message.error('' + error);
            setTimeout(() => {
            setUserInfo(null);
            }, 0);
        }
    }, []); // 空依赖，仅挂载执行

    useEffect(() => {
        // 无有效用户信息则不执行
        if (!userInfo || userInfo.id <= 0) return;
        setTimeout(() => {
        setUserId(userInfo.id);
        }, 0);

        // 用真实用户 ID 获取分类
        getCategoriesByUserId(userInfo.id)
            .then(res => {
                console.log('获取分类成功：', res);
                setCategories(res);
            })
            .catch(err => {
                console.error('获取分类失败：', err);
            });
    }, [userInfo]); // 仅当 userInfo 变化时执行

    useEffect(() => {
        if (selectedCategoryId === null) {
            return;
        }
        getNotesByCategory({
            categoryId: selectedCategoryId,
            userId: userId!
        })
            .then(res => {
                console.log('获取笔记成功：', res);
                setArticles(res);
            })
            .catch(err => {
                console.error('获取笔记失败：', err);
            });
    }, [selectedCategoryId]);

    useEffect(() => {
        if (articles.length === 0) {
            setTimeout(() => {
            setSelectedArticleId(null);
            }, 0);
            return;
        }
        // 如果当前选中的文章不在列表里（比如刚删掉）
        const exists = articles.some(a => a.id === selectedArticleId);
        if (!exists) {
            setTimeout(() => {
            setSelectedArticleId(articles[0].id);
            }, 0);
        }
    }, [articles]);

// useEffect(() => {
//     if (userId === null) return;

//     // 使用 async/await 获取数据
//     const fetchTotalWords = async () => {
//         try {
//             const res = await getUserTotalWordCount(userId);  // 获取的就是 totalWords
//             console.log('获取总字数成功：', res);
//             setTotalWords(res); // res 是 totalWords 类型
//         } catch (err) {
//             console.error('获取总字数失败：', err);
//         }
//     };

//     fetchTotalWords();  // 调用异步函数

// }, [userId, selectedCategoryId]);


    useEffect(() => {
        if (categories.length === 0) return;

        // 如果当前没有选中分类，默认选第一个
        if (selectedCategoryId === null) {
            setTimeout(() => {
            setSelectedCategoryId(categories[0].id);
            }, 0);
        }
    }, [categories]);

    useEffect(() => {
        if (categories.length === 0) return;

        // 如果当前没有选中分类，默认选第一个
        if (selectedCategoryId === null) {
            setTimeout(() => {
            setSelectedCategoryId(categories[0].id);
            }, 0);
        }
    }, [categories]);

    // 替换原来的 matchedArticle 定义
    const matchedArticle = useMemo(() => {
        console.log('匹配文章计算中，当前模式：', viewMode, '选中ID：', selectedArticleId);

        // 先判断是否有选中的文章ID
        if (!selectedArticleId) return null;

        // 🔥 根据视图模式切换数据源
        const targetArticles = viewMode === 'list' ? articles : dateArticles;

        // 从对应数据源里找文章
        if (!targetArticles) return null;
        return targetArticles.find(a => a.id === selectedArticleId);
    }, [viewMode, articles, dateArticles, selectedArticleId]); // 增加 viewMode 和 dateArticles 依赖
    return (
        <div className={styles.container} ref={containerRef}>
            {/* 1. Sidebar */}
            <div className={styles.sidebar}>
                <div className={styles.brandArea}>漫<span>记</span>.</div>
                <div className={styles.userCard}>
                    <div className={styles.avatar}>
                        {userInfo?.avatar ? <img src={userInfo.avatar} alt="avatar" /> : userInfo?.username[0]}
                    </div>
                    <div className={styles.userInfo}>
                        <div className={styles.userName}>{userInfo?.username}</div>
                        <div className={styles.idNumber}>ID: {userInfo?.id}</div>
                    </div>
                </div>
                {/* <div className={styles.statCard}>
                    <div className={styles.statLabel}>
                        <span>LIFETIME WORDS</span>
                    </div>
                    <div className={styles.statNumber}>{totalWords?.totalWordCount}</div>
                </div> */}
                <div className={styles.navHeader}>
                    <span>Categories</span>
                    <button className={styles.addCategoryBtn} onClick={() => addCategory()} >
                        +
                    </button>
                </div>

                <div className={styles.navMenu}>
                    {categories.map(cat => {
                        return (
                            <div
                                key={cat.id}
                                className={`${styles.navItem} ${selectedCategoryId === cat.id ? styles.navItemActive : ''
                                    }`}
                                onClick={() => {
                                    setSelectedCategoryId(cat.id);
                                    setViewMode('list');
                                }}
                            >
                                {/* 左侧：分类名 */}
                                <span>{cat.name}</span>

                                {/* 右侧：删除 */}
                                <div className={styles.navRightGroup}>
                                    {/* ✏️ 编辑分类 */}
                                    <button
                                        className={styles.deleteBtn}
                                        title="Edit Category"
                                        onClick={(e) => {
                                            e.stopPropagation(); // 🔥 防止触发分类切换
                                            handleEditCategoryClick(cat);
                                        }}
                                    >
                                        <EditOutlined />
                                    </button>
                                    <Popconfirm
                                        title="确认删除该分类？"
                                        description="该分类下的文章可能会受影响"
                                        okText="删除"
                                        cancelText="取消"
                                        okButtonProps={{ style: { backgroundColor: '#7a9e9f', color: '#fff' } }}
                                        icon={<DeleteOutlined style={{ color: '#7a9e9f' }} />}
                                        onConfirm={() => handleDeleteCategory(cat.id)}
                                    >
                                        <button
                                            className={styles.deleteBtn}
                                            title="Delete Category"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <DeleteOutlined />
                                        </button>
                                    </Popconfirm>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className={styles.versionInfo}>
                    manji <br />
                    v1.1.0 Stable Build  <br />
                    <span onClick={() => handleLogout()}>退出登录</span>
                </div>

            </div>
            <div
                className={styles.resizer}
                onMouseDown={(e) => startResize(e, 'sidebar')}
            />

            {/* 2. Middle Column */}
            <div className={styles.middleColumn}>
                <div className={styles.middleHeader}>
                    <span className={styles.listTitle}>
                        {/* Index / {selectedCategoryId ? getCategoryName(selectedCategoryId) : 'All'} */}
                    </span>

                    <div className={styles.toggleSwitch}>
                        <button
                            className={`${styles.toggleBtn} ${viewMode === 'list' ? styles.toggleBtnActive : ''}`}
                            onClick={() => {
                                setViewMode('list');
                                setDateArticles([]); // 清空日期笔记数据
                                handleSelectCategory();
                            }}
                        >列表</button>
                        <button
                            className={`${styles.toggleBtn} ${viewMode === 'calendar' ? styles.toggleBtnActive : ''}`}
                            onClick={() => {
                                setViewMode('calendar');
                                setSelectedCategoryId(null); // 清空分类选中，避免 articles 干扰
                                setArticles([]); // 清空分类笔记数据（可选）
                                handleDateSelect(currentDate.format('YYYY-MM-DD')); // 加载当前日期笔记
                            }}
                        >日历</button>
                    </div>
                </div>

                {viewMode === 'list' ? (
                    <div className={styles.listContainer}>
                        {articles?.map(article => (
                            <div
                                key={article.id}
                                className={`${styles.articleItem} ${selectedArticleId === article.id ? styles.articleItemActive : ''
                                    }`}
                                onClick={() => setSelectedArticleId(article.id)}
                            >
                                <h4>{article.title}</h4>

                                <div className={styles.metaInfo}>
                                    <span className={styles.dateText}>
                                        {new Date(article.updateTime).toLocaleDateString()}
                                    </span>
                                </div>

                                {/* 删除按钮 */}
                                <Popconfirm
                                    title="确认删除该笔记？"
                                    okText="删除"
                                    cancelText="取消"
                                    okButtonProps={{
                                        style: {
                                            backgroundColor: '#7a9e9f',
                                            color: '#fff',
                                        }
                                    }}
                                    icon={<DeleteOutlined style={{ color: '#7a9e9f' }} />}
                                    onConfirm={() => handleDeleteArticle(article.id)}
                                >
                                    <button
                                        className={styles.deleteBtn}
                                        title="Delete Note"
                                    >
                                        <DeleteOutlined />
                                    </button>
                                </Popconfirm>
                            </div>
                        ))}
                    </div>

                ) : (
                    <div className={styles.calendarMode}>
                        <Calendar
                            userId={userId!}
                            onDateSelect={handleDateSelect}
                        />
                        <div className={styles.dayListTitle}>RECORDS FOR {currentDate.format('YYYY-MM-DD')}</div>
                        <div className={styles.listContainer}>
                            {dateArticles?.map(article => (
                                <div
                                    key={article.id}
                                    className={`${styles.articleItem} ${selectedArticleId === article.id ? styles.articleItemActive : ''}`}
                                    onClick={() => setSelectedArticleId(article.id)}
                                >
                                    <h4>{article.title}</h4>
                                    <div className={styles.metaInfo}>
                                        <span className={styles.metaTag}>
                                            {/* {getCategoryName(article.categoryId).toUpperCase()} */}
                                        </span>
                                        <span className={styles.dateText}>
                                            {new Date(article.updateTime).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            ))}
                            {dateArticles?.length === 0 && (
                                <div className={styles.emptyState} style={{ height: '200px' }}>
                                    NO DATA
                                </div>
                            )}
                        </div>

                    </div>
                )}
            </div>
            <div
                className={styles.resizer}
                onMouseDown={(e) => startResize(e, 'middleColumn')}
            />

            {/* 3. Content Column */}
            <div className={styles.contentColumn}>
                <button className={styles.fabAddBtn} onClick={handleCreateNew}>
                    +
                </button>
                <div className={styles.statusBar}>
                    <div className={styles.path}>
                        <span>{matchedArticle?.title}</span>
                    </div>
                    <div style={{ marginLeft: 'auto' }}>{mode === 'read' ? '阅读模式' : '编辑模式'}</div>
                </div>

                <div className={styles.readerScroll}>
                    <PaperEditor
                        mode={mode}
                        article={matchedArticle}
                        editingArticle={editingArticle}
                        userInfo={userInfo}
                        onEnterEdit={handleEnterEdit}
                        onChange={setEditingArticle}
                        onSave={handleSave}
                        onCancel={() => {
                            setMode('read');
                            setEditingArticle(null);
                        }}
                    />

                </div>
            </div>
            {isShowModal && <CategoryModel
                isOpen={isShowModal} // 传递弹窗显示状态
                userId={userId} // 传递用户ID
                onClose={() => setIsShowModal(false)} // 传递关闭弹窗的方法
                onSuccess={refreshCategories} // 传递创建成功后的回调（刷新列表）
            />}
            <Modal
                title="编辑分类"
                open={isEditModalOpen}
                okText="保存"
                cancelText="取消"
                onOk={handleUpdateCategory}
                onCancel={() => {
                    setIsEditModalOpen(false);
                    setEditingCategory(null);
                }}
            >
                <Input
                    value={editCategoryName}
                    onChange={(e) => setEditCategoryName(e.target.value)}
                    placeholder="请输入新的分类名"
                    maxLength={20}
                    autoFocus
                />
            </Modal>

        </div>
    );
};

export default Home;