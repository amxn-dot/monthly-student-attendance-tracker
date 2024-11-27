import mongoose, { Schema, Document } from 'mongoose';

export interface IAdmin extends Document {
  username: string;
  email: string;
  password: string;
}

const adminSchema = new Schema({
  username: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true
  },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true
  },
  password: { 
    type: String, 
    required: true 
  }
}, {
  timestamps: true
});

export default mongoose.model<IAdmin>('Admin', adminSchema);