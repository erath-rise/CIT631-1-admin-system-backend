const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// 注册
exports.register = async (req, res) => {
    try {
        const { username, password } = req.body;

        // 检查是否已存在
        const existingUser = await User.findOne({ username });
        if (existingUser) return res.status(400).json({ message: "用户名已存在" });

        // hash 密码
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: "注册成功" });
    } catch (err) {
        res.status(500).json({ message: "服务器错误", error: err.message });
    }
};

// 登录
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ message: "用户不存在" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "密码错误" });

        // 生成 JWT
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

        res.json({ message: "登录成功", token });
    } catch (err) {
        res.status(500).json({ message: "服务器错误", error: err.message });
    }
};

// 重置密码
exports.resetPassword = async (req, res) => {
    try {
        const { username, newPassword } = req.body;

        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ message: "用户不存在" });

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        res.json({ message: "密码重置成功" });
    } catch (err) {
        res.status(500).json({ message: "服务器错误", error: err.message });
    }
};