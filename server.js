const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./src/config/db");

dotenv.config();
connectDB();

const app = express();

// CORS 配置：允许来自 Vercel 前端及本地的请求，并正确处理预检请求
const vercelProjectRegex = /^https:\/\/cit-631-1-admin-system(?:-[a-z0-9-]+)?\.vercel\.app$/;

const defaultAllowedOrigins = [
  "https://cit-631-1-admin-system.vercel.app",
  "https://cit-631-1-admin-system-git-main-erathrises-projects.vercel.app",
  "http://localhost:3000",
  "http://127.0.0.1:3000"
];

const envOrigins = (process.env.CORS_ORIGINS || process.env.CORS_ORIGIN || "")
  .split(",")
  .map(o => o.trim())
  .filter(Boolean);

const allowedOrigins = envOrigins.length > 0 ? envOrigins : defaultAllowedOrigins;

const corsOptions = {
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);
    const isVercelOk = vercelProjectRegex.test(origin);
    if (isVercelOk || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));
// 使用正则以兼容新版 path-to-regexp 对通配符的解析
app.options(/.*/, cors(corsOptions));

app.use(express.json());

// 健康检查
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// 路由
const authRouter = require("./src/routes/auth");
const itemsRouter = require("./src/routes/items");
const employeesRouter = require("./src/routes/employees");

// 兼容历史路径与无 /api 前缀的调用
app.use("/api/auth", authRouter);
app.use("/auth", authRouter);

app.use("/api/items", itemsRouter);
app.use("/items", itemsRouter);

app.use("/api/employees", employeesRouter);
app.use("/employees", employeesRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));