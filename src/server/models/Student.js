const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
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

module.exports = mongoose.model('Student', studentSchema);