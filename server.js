const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./src/config/db");

dotenv.config();
connectDB();

const app = express();

// 允许跨域
app.use(cors({
    origin: "http://localhost:3000", // 前端地址
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
  }));
app.use(express.json());

// 路由
app.use("/api/auth", require("./src/routes/auth"));
app.use("/api/items", require("./src/routes/items"));
app.use("/api/employees", require("./src/routes/employees"));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));