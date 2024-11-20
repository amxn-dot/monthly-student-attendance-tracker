import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  date: { type: String, required: true },
  isPresent: { type: Boolean, required: true },
});

export default mongoose.model('Attendance', attendanceSchema);