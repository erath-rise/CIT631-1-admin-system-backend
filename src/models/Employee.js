const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    department: { type: String, required: true },
    position: { type: String, required: true },
    salary: { type: Number, required: true },
    hireDate: { type: Date, required: true },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    address: { type: String },
    emergencyContact: {
        name: String,
        phone: String,
        relationship: String
    }
}, { timestamps: true });

module.exports = mongoose.model("Employee", employeeSchema);
