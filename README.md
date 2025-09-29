## 后端服务（Node.js + Express + MongoDB）

本项目为管理系统的后端服务，基于 Express 与 Mongoose，提供用户认证、员工管理、事项管理等 REST API。本文档包含：本地开发指南、环境变量说明、API 概览，以及在 Render 平台上的一键部署步骤。

---

### 技术栈
- Node.js
- Express
- MongoDB / Mongoose
- JSON Web Token (JWT)
- dotenv、cors、bcrypt

---

### 目录结构
```
backend/
  server.js                # 应用入口
  src/
    config/db.js           # 数据库连接
    controllers/           # 控制器：auth / employee / item
    middlewares/           # 中间件：认证
    models/                # 数据模型：User / Employee / Item
    routes/                # 路由：/api/auth /api/items /api/employees
```

---

### 本地快速开始
1) 安装依赖
```bash
npm install
```

2) 创建 `.env` 文件
```bash
cp .env.example .env  # 若无 .env.example，可手动创建 .env
```

在 `.env` 中配置：
```
PORT=4000
MONGO_URI=
JWT_SECRET=请替换为更长更随机的密钥
```

3) 启动服务
```bash
npm run dev   # 开发模式（需要 nodemon）
# 或
npm start     # 生产模式
```

默认监听端口：`4000`（或从 `PORT` 环境变量读取）。

---

### 环境变量说明
- `PORT`：服务端口，Render 会自动注入（无需手动设置）。
- `MONGO_URI`：MongoDB 连接字符串（推荐使用 MongoDB Atlas）。
- `JWT_SECRET`：JWT 签名密钥，务必设置为强随机字符串。

### API 概览

统一前缀：`/api`

- 认证模块 `/api/auth`
  - `POST /register`：注册，body `{ username, password }`
  - `POST /login`：登录，body `{ username, password }`，返回 `{ token }`
  - `POST /reset-password`：重置密码，body `{ username, newPassword }`

- 员工模块 `/api/employees`（需要 Bearer Token）
  - `GET /`：分页与筛选获取员工，query `page, limit, search, department, status`
  - `GET /departments`：获取部门列表
  - `GET /:id`：获取员工详情
  - `POST /`：创建员工
  - `PUT /:id`：更新员工
  - `DELETE /:id`：删除员工

- 事项模块 `/api/items`（需要 Bearer Token）
  - `POST /`：创建事项
  - `GET /`：获取事项列表（当前用户）
  - `PUT /:id`：更新事项
  - `DELETE /:id`：删除事项

认证方式：请求头添加
```
Authorization: Bearer <JWT_TOKEN>
```

---

### 使用 curl/httpie 测试

注册：
```bash
curl -X POST http://localhost:4000/api/auth/register \
  -H 'Content-Type: application/json' \
  -d '{"username":"admin","password":"123456"}'
```

登录（获取 token）：
```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"username":"admin","password":"123456"}'
```

携带 token 访问员工列表：
```bash
TOKEN=替换为上一步返回的token
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:4000/api/employees
```

---

## 部署到 Render（Web Service）

以下步骤将把本服务部署为 Render 的 Web Service：

1. 准备工作
   - 将代码推送到 GitHub/GitLab。
   - 准备 MongoDB Atlas 数据库，拿到连接串（示例：`mongodb+srv://<user>:<pass>@<cluster>/<db>?retryWrites=true&w=majority`）。

2. 在 Render 控制台创建服务
   - New + → Web Service。
   - 关联到本仓库，选择分支 `main`。
   - Root Directory：选择本项目后端目录（例如 `backend/`）。
   - Runtime：Node
   - Build Command：`npm install`
   - Start Command：`npm start`
   - Auto Deploy：可开启。

3. 环境变量（Environment)
   - `MONGO_URI`：填写 MongoDB Atlas 连接字符串。
   - `JWT_SECRET`：填写强随机密钥。
   - `PORT`：Render 会自动注入，无需手动设置。
   - 如前端与后端跨域：建议在代码中将 CORS 改为读取环境变量，例如 `CORS_ORIGIN`，并在 Render 设置该变量为前端域名（例如 `https://your-frontend.onrender.com`）。当前仓库中 `server.js` 固定了 `origin: "http://localhost:3000"`，若不修改代码，线上跨域会失败。

4. 连接数据库
   - 在 MongoDB Atlas 的 Network Access 中允许来自 Render 出口地址的连接（通常可设置为允许所有，或添加 0.0.0.0/0 测试后再收紧）。

5. 部署
   - 点击 Deploy，等待构建完成。
   - 成功后 Render 会分配一个 `onrender.com` 域名，用于访问后端 API。
