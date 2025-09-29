const Employee = require("../models/Employee");

// 获取所有员工
exports.getAllEmployees = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '', department = '', status = '' } = req.query;
        
        // 构建查询条件
        const query = {};
        
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { phone: { $regex: search, $options: 'i' } }
            ];
        }
        
        if (department) {
            query.department = department;
        }
        
        if (status) {
            query.status = status;
        }

        const employees = await Employee.find(query)
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Employee.countDocuments(query);

        res.json({
            employees,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        });
    } catch (err) {
        res.status(500).json({ message: "服务器错误", error: err.message });
    }
};

// 根据ID获取员工
exports.getEmployeeById = async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (!employee) {
            return res.status(404).json({ message: "员工不存在" });
        }
        res.json(employee);
    } catch (err) {
        res.status(500).json({ message: "服务器错误", error: err.message });
    }
};

// 创建员工
exports.createEmployee = async (req, res) => {
    try {
        const {
            name,
            email,
            phone,
            department,
            position,
            salary,
            hireDate,
            address,
            emergencyContact
        } = req.body;

        // 检查邮箱是否已存在
        const existingEmployee = await Employee.findOne({ email });
        if (existingEmployee) {
            return res.status(400).json({ message: "邮箱已存在" });
        }

        const employee = new Employee({
            name,
            email,
            phone,
            department,
            position,
            salary,
            hireDate,
            address,
            emergencyContact
        });

        await employee.save();
        res.status(201).json({ message: "员工创建成功", employee });
    } catch (err) {
        res.status(500).json({ message: "服务器错误", error: err.message });
    }
};

// 更新员工
exports.updateEmployee = async (req, res) => {
    try {
        const {
            name,
            email,
            phone,
            department,
            position,
            salary,
            hireDate,
            status,
            address,
            emergencyContact
        } = req.body;

        // 检查邮箱是否被其他员工使用
        const existingEmployee = await Employee.findOne({ 
            email, 
            _id: { $ne: req.params.id } 
        });
        if (existingEmployee) {
            return res.status(400).json({ message: "邮箱已被其他员工使用" });
        }

        const employee = await Employee.findByIdAndUpdate(
            req.params.id,
            {
                name,
                email,
                phone,
                department,
                position,
                salary,
                hireDate,
                status,
                address,
                emergencyContact
            },
            { new: true, runValidators: true }
        );

        if (!employee) {
            return res.status(404).json({ message: "员工不存在" });
        }

        res.json({ message: "员工更新成功", employee });
    } catch (err) {
        res.status(500).json({ message: "服务器错误", error: err.message });
    }
};

// 删除员工
exports.deleteEmployee = async (req, res) => {
    try {
        const employee = await Employee.findByIdAndDelete(req.params.id);
        if (!employee) {
            return res.status(404).json({ message: "员工不存在" });
        }
        res.json({ message: "员工删除成功" });
    } catch (err) {
        res.status(500).json({ message: "服务器错误", error: err.message });
    }
};

// 获取部门列表
exports.getDepartments = async (req, res) => {
    try {
        const departments = await Employee.distinct('department');
        res.json(departments);
    } catch (err) {
        res.status(500).json({ message: "服务器错误", error: err.message });
    }
};
