import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  console.log('Received Token:', token);
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    console.log('JWT_SECRET:', process.env.JWT_SECRET); // Debug: Ensure secret is loaded
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded Token:', decoded);
    req.user = decoded;
    next();
  } catch (error) {
    console.log('Token Verification Error:', error.message);
    res.status(401).json({ message: 'Invalid token' });
  }
};