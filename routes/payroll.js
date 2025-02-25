import express from 'express';
import Payroll from '../models/Payroll.js';
import Attendance from '../models/Attendance.js';
import Leave from '../models/Leave.js';
import Employee from '../models/Employee.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Generate payroll (HR only)
router.post('/generate', authMiddleware, async (req, res) => {
  if (req.user.role !== 'hr') {
    return res.status(403).json({ success: false, message: 'Access denied' });
  }

  const { month } = req.body;
  try {
    const employees = await Employee.find();
    const payrolls = [];

    for (const employee of employees) {
      const attendance = await Attendance.find({
        employeeId: employee._id,
        date: {
          $gte: new Date(`${month}-01`),
          $lte: new Date(`${month}-31`),
        },
      });

      const leaves = await Leave.find({
        employeeId: employee._id,
        status: 'approved',
        startDate: { $lte: new Date(`${month}-31`) },
        endDate: { $gte: new Date(`${month}-01`) },
      });

      const presentDays = attendance.length;
      const totalDays = 30;
      const leaveDays = leaves.reduce((acc, leave) => {
        const days = Math.ceil((leave.endDate - leave.startDate) / (1000 * 60 * 60 * 24));
        return acc + days;
      }, 0);

      const calculatedSalary = (employee.baseSalary / totalDays) * (presentDays - leaveDays);

      const payroll = new Payroll({
        employeeId: employee._id,
        month,
        baseSalary: employee.baseSalary,
        presentDays,
        totalDays,
        calculatedSalary,
      });
      await payroll.save();
      payrolls.push(payroll);
    }

    res.status(201).json({ success: true, message: 'Payroll generated successfully', payrolls });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Error generating payroll: ' + error.message });
  }
});

// Get payroll (HR or Employee for own record)
router.get('/', authMiddleware, async (req, res) => {
  try {
    if (req.user.role === 'hr') {
      const payrolls = await Payroll.find().populate('employeeId', 'name');
      res.json({ success: true, message: 'Payroll records retrieved successfully', payrolls });
    } else {
      const payrolls = await Payroll.find({ employeeId: req.user.id });
      res.json({ success: true, message: 'Your payroll records retrieved successfully', payrolls });
    }
  } catch (error) {
    res.status(400).json({ success: false, message: 'Server error: ' + error.message });
  }
});

export default router;