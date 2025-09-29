// test-db.js
const mongoose = require("mongoose");
require("dotenv").config();

const testDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ MongoDB 连接成功！");
        process.exit(0);
    } catch (err) {
        console.error("❌ MongoDB 连接失败：", err.message);
        process.exit(1);
    }
};

testDB();