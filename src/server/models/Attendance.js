const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  studentId: { 
    type: mongoose.Schema.Types.ObjectId, 
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

module.exports = mongoose.model('Attendance', attendanceSchema);