import mongoose, { Schema, Document } from 'mongoose';

export interface IStudent extends Document {
  name: string;
  rollNumber: string;
  class: string;
}

const studentSchema = new Schema({
  name: { 
    type: String, 
    required: true,
    trim: true
  },
  rollNumber: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true
  },
  class: { 
    type: String, 
    required: true,
    trim: true
  }
}, {
  timestamps: true
});

export default mongoose.model<IStudent>('Student', studentSchema);