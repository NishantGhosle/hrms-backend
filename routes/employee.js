import express from 'express';
import bcrypt from 'bcryptjs';
import Employee from '../models/Employee.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Create Employee (HR only) with Base64 profile picture
router.post('/', authMiddleware, async (req, res) => {
  if (req.user.role !== 'hr') {
    return res.status(403).json({ success: false, message: 'Access denied' });
  }

  try {
    const { password, profilePicture, ...employeeData } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const employee = new Employee({
      ...employeeData,
      password: hashedPassword,
      profilePicture: profilePicture || null,
    });
    await employee.save();
    res.status(201).json({ success: true, message: 'Employee added successfully', employee });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Error adding employee: ' + error.message });
  }
});

// Get all employees (HR only)
router.get('/', authMiddleware, async (req, res) => {
  if (req.user.role !== 'hr') {
    return res.status(403).json({ success: false, message: 'Access denied' });
  }
  try {
    const employees = await Employee.find().select('-password');
    res.json({ success: true, message: 'Employees retrieved successfully', employees });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error: ' + error.message });
  }
});

// Get own profile (Employee or HR)
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const employee = await Employee.findById(req.user.id).select('-password');
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }
    res.json({ success: true, message: 'Profile retrieved successfully', employee });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error: ' + error.message });
  }
});

export default router;