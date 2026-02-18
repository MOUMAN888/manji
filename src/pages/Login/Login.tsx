import styles from "./Login.module.css";
import { login, register } from "../../api/userApi";
import { useNavigate } from 'react-router-dom'; 
import { message } from "antd";
import { useState } from "react";

// 如果你使用 React Router，取消下面的注释并替换 <a> 标签
// import { Link } from 'react-router-dom';

function Login() {
    const [isRegister, setIsRegister] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

      // 2. 获取跳转函数 navigate
    const navigate = useNavigate();
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!username || !password) {
            message.warning("请输入用户名和密码");
            return;
        }

        try {
            setLoading(true);

            if (isRegister) {
                // 登录
                const res = await login({ username, password });
                console.log("登录成功", res);
                if(res){
                    navigate('/home');
                    localStorage.setItem("userInfo", JSON.stringify(res));
                }
            } else {
                // 注册
                const res = await register({ username, password });
                console.log("注册成功", res.data);
                message.success("注册成功，请登录");
                setIsRegister(true);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };



    return (
        <div className={styles.container}>
            {/* 左侧：终端风格品牌区 */}
            <div className={styles.authSidebar}>
                {/* 装饰背景：代码雨 */}
                <div className={styles.codeBg}>
                    0101 WEB LOG SYSTEM INIT...
                    <br />
                    LOADING MODULES...
                    <br />
                    {">"} USER_AUTH_SERVICE [OK]
                    <br />
                    {">"} DATABASE_CONNECT [OK]
                    <br />
                    {">"} STYLE_RENDER [OK]
                    <br />
                    --------------------------
                    <br />
                    VAR ACCENT = "#7a9e9f";
                    <br />
                    VAR RECORD = TRUE;
                    <br />
                    --------------------------
                    <br />
                    MEMORY STACK TRACE...
                    <br />
                    0x004F2A saving...
                    <br />
                </div>

                <div className={styles.logo}>
                    漫<span>记</span>
                    <div className={styles.cursor}></div>
                </div>

                <div className={styles.brandQuote}>
                    <h2>
                        System Ready.
                        <br />
                        Waiting for input.
                    </h2>
                    <span className={styles.codeComment}>
                        The internet is a canvas, record your strokes.
                    </span>
                </div>

                <div className={styles.serverId}>v1.1.0 Stable Build  </div>
            </div>

            {/* 右侧：表单区 */}
            <div className={styles.authContent}>
                {/* 装饰：角落准星 */}
                <div
                    className={styles.crosshair}
                    style={{ top: "30px", left: "30px" }}
                ></div>
                <div
                    className={styles.crosshair}
                    style={{ bottom: "30px", right: "30px" }}
                ></div>

                {/* 如果使用 Router，换成 <Link to="/" ...> */}
                <a href="/" className={styles.backHome}>
                    &lt; ESC
                </a>

                <div className={styles.authCard}>
                    <div className={styles.cardDecoration}>
                        <span></span>
                        <span></span>
                    </div>

                    <div className={styles.authHeader}>
                        <h1>IDENTIFICATION</h1>
                        <p>请输入您的用户名和密码以继续。</p>
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className={styles.authForm}
                    >
                        <div className={styles.formGroup}>
                            <label htmlFor="email">Username</label>
                            <div className={styles.inputWrapper}>
                                <input
                                    type="text"
                                    id="username"
                                    className={styles.formInput}
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    autoComplete="off"
                                />
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="password">password</label>
                            <div className={styles.inputWrapper}>
                                <input
                                    type="password"
                                    id="password"
                                    className={styles.formInput}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>
{/* 
                        <div className={styles.formFooter}>
                            <label className={styles.checkboxLabel}>
                                <input type="checkbox" className={styles.checkboxInput} />
                                保持登录
                            </label>
                            <a href="/reset-password">重置密码</a>
                        </div> */}

                        <button type="submit" className={styles.btnBlock} disabled={loading}>
                            {loading
                                ? "PROCESSING..."
                                : isRegister
                                ? "提交登录"
                                : "创建账号"}
                        </button>

                        <div className={styles.footerLink}>
                            {isRegister ? "还没有账号?" : "已有账号?"}
                            <span onClick={() => setIsRegister(!isRegister)} >
                                {isRegister ? '创建账号' : '登录账号'}
                            </span>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;
