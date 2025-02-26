import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import Employee from './models/Employee.js';
import { dbConnect } from './config/db.js';

async function seedDatabase() {
  await dbConnect();

  const hrPassword = await bcrypt.hash('admin123', 10);

  await Employee.deleteMany({});
  await Employee.create({
    name: 'HR Admin',
    email: 'hr@company.com',
    password: 'admin123',
    role: 'hr',
    contact: '1234567890',
    baseSalary: 50000,
  });

  console.log('HR user seeded');
  mongoose.connection.close();
}

seedDatabase();