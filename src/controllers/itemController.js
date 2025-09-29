const Item = require("../models/Item");

// 创建
exports.createItem = async (req, res) => {
    try {
        const { title, description } = req.body;
        const newItem = new Item({ title, description, createdBy: req.user.id });
        await newItem.save();
        res.status(201).json(newItem);
    } catch (err) {
        res.status(500).json({ message: "服务器错误", error: err.message });
    }
};

// 获取所有
exports.getItems = async (req, res) => {
    try {
        const items = await Item.find({ createdBy: req.user.id });
        res.json(items);
    } catch (err) {
        res.status(500).json({ message: "服务器错误", error: err.message });
    }
};

// 更新
exports.updateItem = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedItem = await Item.findOneAndUpdate(
            { _id: id, createdBy: req.user.id },
            req.body,
            { new: true }
        );
        res.json(updatedItem);
    } catch (err) {
        res.status(500).json({ message: "服务器错误", error: err.message });
    }
};

// 删除
exports.deleteItem = async (req, res) => {
    try {
        const { id } = req.params;
        await Item.findOneAndDelete({ _id: id, createdBy: req.user.id });
        res.json({ message: "删除成功" });
    } catch (err) {
        res.status(500).json({ message: "服务器错误", error: err.message });
    }
};