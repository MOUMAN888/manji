# 📒 Manji · 笔记与日记应用

> 一个基于 **React + TypeScript + Vite** 与 **Node.js + Express + Sequelize + MySQL** 构建的全栈笔记管理系统。

Manji 是一个支持分类管理、日历查看、关键字搜索和数据统计的笔记应用，帮助用户记录日常生活、学习笔记和写作内容，并通过数据可视化了解自己的记录习惯。

---

## ✨ 项目亮点

* 🔐 完整用户认证系统（注册/登录/信息修改）
* 📝 支持笔记CRUD与自动字数统计
* 📅 按月查看活跃记录日期
* 🗂 分类管理+级联删除
* 🔍 标题/内容关键字搜索
* 📊 统计总字数与笔记数量
* ⚙️ 前后端完全分离架构
* 🧱 TypeScript全栈开发

---

## 🏗 技术架构

### 前端技术栈

* React 19
* TypeScript
* Vite
* React Router DOM
* Ant Design
* Axios 封装请求

### 后端技术栈

* Node.js
* Express
* Sequelize ORM
* MySQL（mysql2）
* bcryptjs（密码加密）
* TypeScript

---

## 📂 项目结构

```text
manji/
├─ src/                      # 前端源码
│  ├─ api/                   # API 请求封装
│  ├─ pages/                 # 页面模块
│  ├─ components/            # 公共组件
│  └─ utils/                 # 工具函数
│
├─ manji-backend/            # 后端服务
│  ├─ src/
│  │  ├─ models/             # Sequelize 数据模型
│  │  ├─ routes/             # 路由层
│  │  ├─ services/           # 业务逻辑层
│  │  ├─ db/                 # 数据库配置
│  │  └─ utils/              # 响应封装
│  ├─ dist/                  # 编译输出目录
│  └─ API_DOCUMENTATION.md   # 后端接口文档
│
└─ README.md
```

---

## 🚀 快速开始

### 1️⃣ 克隆项目

```bash
git clone https://github.com/MOUMAN888/manji.git
cd manji
```

---

### 2️⃣ 安装依赖

#### 前端

```bash
npm install
```

#### 后端

```bash
cd manji-backend
npm install
```

---

### 3️⃣ 配置数据库

在：

```
manji-backend/src/db
```

修改 MySQL 连接配置：

* 数据库名建议：`note_db`
* 字符集建议：`utf8mb4`

> 首次启动时 Sequelize 会根据模型自动建表。

---

### 4️⃣ 启动后端

默认端口：`3002`

```bash
cd manji-backend
npm run dev
```

或自定义端口：

```bash
PORT=3003 npm run dev
```

成功启动后会看到：

```
✅ MySQL 连接成功！
✅ 数据库表同步成功！
✅ 后端服务运行在 http://localhost:<PORT>
```

---

### 5️⃣ 启动前端

回到项目根目录：

```bash
cd manji
npm run dev
```

默认地址：

```
http://localhost:5173
```

前端请求地址在：

```
src/utils/request.ts
```

配置 `baseURL`：

```ts
http://localhost:3002/api
```

---

## 📡 API 文档

完整接口说明请查看：

```
manji-backend/API_DOCUMENTATION.md
```

包含：

* 用户接口
* 分类接口
* 笔记接口
* 搜索接口
* 统计接口
* 请求示例
* 响应结构
* 错误说明

---

## 🧠 功能模块说明

### 👤 用户模块

* 注册
* 登录
* 修改用户名
* 修改个性签名

---

### 🗂 分类模块

* 创建分类
* 修改分类
* 删除分类（级联删除笔记）

---

### 📝 笔记模块

* 创建笔记（自动统计字数）
* 编辑笔记
* 删除笔记
* 按分类查询
* 按日期查询
* 关键字搜索

---

### 📊 数据统计模块

* 总字数统计
* 笔记数量统计
* 月活跃天数查询

---

## 🛠 开发与构建

### 前端

```bash
npm run dev       # 开发
npm run build     # 构建
npm run preview   # 预览
```

### 后端

```bash
npm run dev       # 开发（热重启）
npm run build     # 编译
npm run start     # 运行编译后文件
```

---




