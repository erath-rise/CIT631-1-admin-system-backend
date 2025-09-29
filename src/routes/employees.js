const express = require("express");
const router = express.Router();
const employeeController = require("../controllers/employeeController");
const authMiddleware = require("../middlewares/authMiddleware");

// 所有员工相关路由都需要认证
router.use(authMiddleware);

// 获取所有员工
router.get("/", employeeController.getAllEmployees);

// 获取部门列表
router.get("/departments", employeeController.getDepartments);

// 根据ID获取员工
router.get("/:id", employeeController.getEmployeeById);

// 创建员工
router.post("/", employeeController.createEmployee);

// 更新员工
router.put("/:id", employeeController.updateEmployee);

// 删除员工
router.delete("/:id", employeeController.deleteEmployee);

module.exports = router;
