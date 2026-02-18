import styles from './Site.module.css';
import { useNavigate } from 'react-router-dom';

function Site() {
    const navigate = useNavigate();
    const handleLogin = () => {
        if (!localStorage.getItem('userInfo'))
            navigate('/login');
        else{
            navigate('/home');
        }
    };
    return (
        <div className={styles.pageWrapper}>
            {/* 背景装饰：角落的十字准星 */}
            <div className={styles.decorCross} style={{ top: '100px', left: '5%' }}></div>
            <div className={styles.decorCross} style={{ bottom: '100px', right: '5%' }}></div>

            <header className={styles.header}>
                <div className={styles.logo}>
                    漫<span>记</span>
                </div>
                <nav>
                    <ul className={styles.navList}>
                        <li><a href="#features">功能</a></li>
                        <li><a href="#api">API文档</a></li>
                        <li>
                            <a href="/login" className={styles.btnText}>登录</a>
                        </li>
                        <li>
                            <button
                                className={styles.btnPrimary}
                                onClick={handleLogin}
                            >
                                开始记录 &rarr;
                            </button>
                        </li>
                    </ul>
                </nav>
            </header>

            <section className={styles.hero}>
                <div className={styles.heroText}>
                    <span className={styles.tagPill}>v1.0 Now Available</span>
                    <h1>
                        捕捉思维的<br />
                        每一个<span style={{ color: 'var(--accent)' }}>字节</span>。
                    </h1>
                    <p>
                        不仅是书签，更是你的互联网时光胶囊。
                        <span className={styles.codeSnippet}>
                            &lt;Snapshot&gt; &lt;Archive&gt; &lt;Recall&gt;
                        </span>
                    </p>
                    <div className={styles.ctaGroup}>
                        <a href="/login" className={styles.btnPrimary}>
                            免费注册
                        </a>
                        <a href="#demo" style={{ color: 'var(--accent)' }} className={styles.btnOutline}>
                            查看演示
                        </a>
                    </div>
                </div>

                <div className={styles.heroVisual}>
                    <div className={styles.glowBg}></div>

                    <div className={styles.cardStack}>
                        {/* 悬浮标签 */}
                        <div className={`${styles.floatingBadge} ${styles.badge1}`}>Type: HTML</div>
                        <div className={`${styles.floatingBadge} ${styles.badge2}`}>Status: Saved</div>
                        <div className={`${styles.floatingBadge} ${styles.badge3}`}>24kb</div>

                        <div className={styles.browserHeader}>
                            <div className={styles.dots}>
                                <div className={styles.dot} style={{ background: '#ff5f56', border: 'none' }}></div>
                                <div className={styles.dot} style={{ background: '#ffbd2e', border: 'none' }}></div>
                                <div className={styles.dot} style={{ background: '#27c93f', border: 'none' }}></div>
                            </div>
                            <div className={styles.addressBar}></div>
                        </div>
                        <div className={styles.browserBody}>
                            {/* 模拟数据流/代码行 */}
                            <div className={`${styles.codeLine} ${styles.w30}`}></div>
                            <div className={`${styles.codeLine} ${styles.w70}`}></div>
                            <div className={`${styles.codeLine} ${styles.w50}`}></div>
                            <div className={`${styles.codeLine} ${styles.w70}`} style={{ marginTop: '10px' }}></div>
                            <div className={`${styles.codeLine} ${styles.w30}`}></div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Site;