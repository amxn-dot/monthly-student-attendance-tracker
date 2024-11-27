import mongoose, { Schema, Document } from 'mongoose';
import { IStudent } from './Student';

export interface IAttendance extends Document {
  studentId: IStudent['_id'];
  date: string;
  isPresent: boolean;
}

const attendanceSchema = new Schema({
  studentId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Student',
    required: true
  },
  date: { 
    type: String, 
    required: true 
  },
  isPresent: { 
    type: Boolean, 
    required: true,
    default: false
  }
}, {
  timestamps: true
});

export default mongoose.model<IAttendance>('Attendance', attendanceSchema);