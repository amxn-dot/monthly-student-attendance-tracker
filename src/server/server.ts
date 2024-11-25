import express, { Request, Response } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Student from './models/Student';
import Attendance from './models/Attendance';
import Admin from './models/Admin';

dotenv.config();

const app = express();
const router = express.Router();

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/attendance-system')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Auth routes
router.post('/auth/login', async (req: Request, res: Response) => {
  try {
    const { emailOrUsername, password } = req.body;
    const admin = await Admin.findOne({
      $or: [{ email: emailOrUsername }, { username: emailOrUsername }]
    });

    if (!admin || admin.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.json({ message: 'Login successful' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Student routes
router.get('/students', async (_req: Request, res: Response) => {
  try {
    const students = await Student.find().sort({ name: 1 }); // Sort by name ascending
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/students', async (req: Request, res: Response) => {
  try {
    const existingStudent = await Student.findOne({
      $or: [
        { name: req.body.name },
        { rollNumber: req.body.rollNumber }
      ]
    });

    if (existingStudent) {
      return res.status(400).json({ 
        message: 'A student with this name or roll number already exists' 
      });
    }

    const student = new Student(req.body);
    await student.save();
    res.status(201).json(student);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/students/:id', async (req: Request, res: Response) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    await Attendance.deleteMany({ studentId: req.params.id });
    res.json({ message: 'Student deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Attendance routes
router.get('/attendance', async (_req: Request, res: Response) => {
  try {
    const attendance = await Attendance.find().populate('studentId');
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/attendance', async (req: Request, res: Response) => {
  try {
    const attendance = await Attendance.create(req.body);
    res.status(201).json(attendance);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Mount the router with the /api prefix
app.use('/api', router);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));