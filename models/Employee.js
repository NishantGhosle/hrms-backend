import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['employee', 'hr'], default: 'employee' },
  contact: { type: String, required: true },
  aadhaar: { type: String, unique: true },
  pan: { type: String, unique: true },
  bankDetails: {
    accountNo: { type: String },
    ifsc: { type: String },
  },
  emergencyContact: { type: String },
  address: { type: String },
  profilePicture: { type: String }, 
  baseSalary: { type: Number, required: true },
}, { timestamps: true });

export default mongoose.model('Employee', employeeSchema);