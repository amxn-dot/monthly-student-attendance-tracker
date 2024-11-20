import axios from 'axios';
import { Student, AttendanceRecord } from '@/types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = {
  // Auth
  login: async (emailOrUsername: string, password: string) => {
    const response = await axios.post(`${API_URL}/auth/login`, { emailOrUsername, password });
    return response.data;
  },

  // Students
  getStudents: async () => {
    const response = await axios.get(`${API_URL}/students`);
    return response.data;
  },

  createStudent: async (student: Omit<Student, 'id'>) => {
    const response = await axios.post(`${API_URL}/students`, student);
    return response.data;
  },

  deleteStudent: async (id: string) => {
    const response = await axios.delete(`${API_URL}/students/${id}`);
    return response.data;
  },

  // Attendance
  getAttendance: async () => {
    const response = await axios.get(`${API_URL}/attendance`);
    return response.data;
  },

  markAttendance: async (records: Omit<AttendanceRecord, 'id'>[]) => {
    const response = await axios.post(`${API_URL}/attendance`, records);
    return response.data;
  },
};