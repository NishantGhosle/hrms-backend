import mongoose from 'mongoose';

const payrollSchema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
  month: { type: String, required: true },
  baseSalary: { type: Number, required: true },
  presentDays: { type: Number, required: true },
  totalDays: { type: Number, required: true },
  calculatedSalary: { type: Number, required: true },
}, { timestamps: true });

export default mongoose.model('Payroll', payrollSchema);