import express from 'express';
import Leave from '../models/Leave.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Apply for leave (Employee only)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const leave = new Leave({
      employeeId: req.user.id,
      ...req.body,
    });
    await leave.save();
    res.status(201).json({ success: true, message: 'Leave applied successfully', leave });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Error applying leave: ' + error.message });
  }
});

// Approve/Reject leave (HR only)
router.put('/:id', authMiddleware, async (req, res) => {
  if (req.user.role !== 'hr') {
    return res.status(403).json({ success: false, message: 'Access denied' });
  }

  try {
    const leave = await Leave.findById(req.params.id);
    if (!leave) return res.status(404).json({ success: false, message: 'Leave not found' });

    leave.status = req.body.status;
    await leave.save();
    res.json({ success: true, message: `${leave.status === 'approved' ? 'Approved' : 'Rejected'} leave successfully`, leave });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Error updating leave: ' + error.message });
  }
});

// Get all leave requests (HR only)
router.get('/', authMiddleware, async (req, res) => {
  if (req.user.role !== 'hr') {
    return res.status(403).json({ success: false, message: 'Access denied' });
  }
  try {
    const leaves = await Leave.find().populate('employeeId', 'name');
    res.json({ success: true, message: 'Leave requests retrieved successfully', leaves });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error: ' + error.message });
  }
});

export default router;