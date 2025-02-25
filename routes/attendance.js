import express from 'express';
import Attendance from '../models/Attendance.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Check-in (Employee only)
router.post('/check-in', authMiddleware, async (req, res) => {
  const currentHour = new Date().getHours();
  if (currentHour < 9 || currentHour > 18) {
    return res.status(400).json({ success: false, message: 'Check-in allowed only between 9 AM - 6 PM' });
  }

  try {
    const attendance = new Attendance({
      employeeId: req.user.id,
      checkIn: new Date(),
    });
    await attendance.save();
    res.status(201).json({ success: true, message: 'Checked in successfully', attendance });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Error checking in: ' + error.message });
  }
});

// Check-out (Employee only)
router.put('/check-out', authMiddleware, async (req, res) => {
  try {
    const attendance = await Attendance.findOne({
      employeeId: req.user.id,
      date: { $gte: new Date().setHours(0, 0, 0, 0) },
    });
    if (!attendance) return res.status(404).json({ success: false, message: 'No check-in found today' });

    attendance.checkOut = new Date();
    await attendance.save();
    res.json({ success: true, message: 'Checked out successfully', attendance });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Error checking out: ' + error.message });
  }
});

// Get attendance records (HR or Employee)
router.get('/', authMiddleware, async (req, res) => {
  try {
    if (req.user.role === 'hr') {
      const records = await Attendance.find().populate('employeeId', 'name');
      res.json({ success: true, message: 'Attendance records retrieved successfully', records });
    } else {
      const records = await Attendance.find({ employeeId: req.user.id });
      res.json({ success: true, message: 'Your attendance records retrieved successfully', records });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error: ' + error.message });
  }
});

export default router;