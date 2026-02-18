import styles from '../../Home.module.css';
import type { Article, Mode, UserProfile } from '../../types';

interface PaperEditorProps {
    mode: Mode;
    article: Article | null | undefined;
    editingArticle: Article | null;
    userInfo: UserProfile | null;
    onEnterEdit: (article: Article) => void;
    onChange: (article: Article) => void;
    onSave: () => void;
    onCancel: () => void;
}
const cls = (...classes: (string | undefined)[]) => classes.filter(Boolean).join(' ');
export default function PaperEditor({
    mode,
    article,
    editingArticle,
    userInfo,
    onEnterEdit,
    onChange,
    onSave,
    onCancel
}: PaperEditorProps) {
    const articleToShow = mode === 'edit' ? editingArticle : article;

    if (!articleToShow) {
        return (
            <div className={styles.emptyState}>
                <div>SELECT A FILE TO READ</div>
                <div style={{ fontSize: '3rem', opacity: 0.2, marginTop: '20px' }}>
                    &lt;/&gt;
                </div>
            </div>
        );
    }

    return (
        <div className={styles.paperCard}>
            {mode === 'edit' && editingArticle ? (
                <>
                    <input
                        className={styles.editTitle}
                        value={editingArticle.title}
                        onChange={(e) =>
                            onChange({ ...editingArticle, title: e.target.value })
                        }
                        placeholder="请输入标题"
                        autoFocus
                    />

                    <textarea
                        className={styles.editContent}
                        value={editingArticle.content}
                        onChange={(e) =>
                            onChange({ ...editingArticle, content: e.target.value })
                        }
                        placeholder="开始书写内容..."
                    />

                    <div className={styles.editorActions}>
                        <button 
                            className={cls(styles.btnBase, styles.cancelBtn)} 
                            onClick={onCancel}>取消
                        </button>
                        <button 
                            className={cls(styles.btnBase, styles.saveBtn)} 
                            onClick={onSave}>保存
                        </button>
                    </div>
                </>
            ) : (
                <>
                    <div
                        className={styles.contentTitle}
                        onClick={() => article && onEnterEdit(article)}
                    >
                        {article?.title}
                    </div>

                    <div className={styles.contentMetaBlock}>
                        <span>AUTHOR: {userInfo?.username}</span>
                        <span>DATE: {article?.updateTime ? new Date(article.updateTime).toLocaleDateString() : 'N/A'}</span>
                        <span>WORDS: {article?.wordCount}</span>
                    </div>

                    <div
                        className={styles.contentText}
                        onClick={() => article && onEnterEdit(article)}
                    >
                        {article?.content}
                    </div>
                </>
            )}
        </div>
    );
}
