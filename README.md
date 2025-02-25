
---

### `backend/README.md`
```markdown
# HRMS Backend

## Project Overview
The HRMS (Human Resource Management System) backend is a Node.js/Express application with MongoDB (using Mongoose) for data storage, designed to handle API requests for employee management, attendance tracking, leave requests, and payroll processing. It provides RESTful endpoints with JWT-based authentication and role-based access control for HR and employee roles. The backend integrates with a React frontend (via Vite) for a complete HRMS solution.

## How to Install and Run Locally
### Prerequisites
- Node.js (v16+)
- npm or Yarn
- MongoDB (local or MongoDB Atlas)

### Setup
1. Navigate to the `backend/` directory:
   ```bash
   cd backend
   npm install
   MONGO_URI=mongodb+srv://nishantghosle7:2q5kJOluy9yrURqo@hrms.l6a8j.mongodb.net/?retryWrites=true&w=majority&appName=hrms
JWT_SECRET=secret123
EMAIL=hr@company.com
PASSWORD=admin123
PORT=5000
npm start

### Deployment Links
Backend API: https://hrms-backend-9vbm.onrender.com