const express = require("express");
const { createItem, getItems, updateItem, deleteItem } = require("../controllers/itemController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, createItem);
router.get("/", authMiddleware, getItems);
router.put("/:id", authMiddleware, updateItem);
router.delete("/:id", authMiddleware, deleteItem);

module.exports = router;