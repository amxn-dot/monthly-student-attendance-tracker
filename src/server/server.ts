import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Student from './models/Student';
import Attendance from './models/Attendance';
import Admin from './models/Admin';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/attendance-system')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Admin routes
app.post('/api/auth/login', async (req: Request, res: Response) => {
  try {
    const { emailOrUsername, password } = req.body;
    console.log('Login attempt:', emailOrUsername);

    const admin = await Admin.findOne({
      $or: [{ email: emailOrUsername }, { username: emailOrUsername }]
    });

    if (!admin || admin.password !== password) {
      console.log('Login failed: Invalid credentials');
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log('Login successful for:', emailOrUsername);
    res.json({ 
      message: 'Login successful',
      admin: { username: admin.username, email: admin.email }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Student routes
app.get('/api/students', async (_req: Request, res: Response) => {
  try {
    console.log('Fetching all students');
    const students = await Student.find().sort({ name: 1 });
    console.log(`Found ${students.length} students`);
    res.json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/students', async (req: Request, res: Response) => {
  try {
    console.log('Creating new student:', req.body);
    const existingStudent = await Student.findOne({
      $or: [
        { name: req.body.name },
        { rollNumber: req.body.rollNumber }
      ]
    });

    if (existingStudent) {
      console.log('Student already exists:', existingStudent);
      return res.status(400).json({ 
        message: 'A student with this name or roll number already exists' 
      });
    }

    const student = new Student(req.body);
    await student.save();
    console.log('Created new student:', student);
    res.status(201).json(student);
  } catch (error) {
    console.error('Error creating student:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.delete('/api/students/:id', async (req: Request, res: Response) => {
  try {
    console.log('Deleting student:', req.params.id);
    await Student.findByIdAndDelete(req.params.id);
    await Attendance.deleteMany({ studentId: req.params.id });
    console.log('Student and related attendance records deleted');
    res.json({ message: 'Student deleted' });
  } catch (error) {
    console.error('Error deleting student:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Attendance routes
app.get('/api/attendance', async (_req: Request, res: Response) => {
  try {
    console.log('Fetching all attendance records');
    const attendance = await Attendance.find().populate('studentId');
    console.log(`Found ${attendance.length} attendance records`);
    res.json(attendance);
  } catch (error) {
    console.error('Error fetching attendance:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/attendance', async (req: Request, res: Response) => {
  try {
    console.log('Creating new attendance record:', req.body);
    const attendance = new Attendance(req.body);
    await attendance.save();
    console.log('Created new attendance record:', attendance);
    res.status(201).json(attendance);
  } catch (error) {
    console.error('Error creating attendance record:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app;