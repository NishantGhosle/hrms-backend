import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
  checkIn: { type: Date },
  checkOut: { type: Date },
  date: { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.model('Attendance', attendanceSchema);