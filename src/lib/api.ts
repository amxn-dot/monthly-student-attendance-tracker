import axios from 'axios';
import { Student, AttendanceRecord } from '@/types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getStoredData = (key: string) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

const setStoredData = (key: string, data: any) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const api = {
  // Auth
  login: async (emailOrUsername: string, password: string) => {
    const response = await axios.post(`${API_URL}/auth/login`, { emailOrUsername, password });
    return response.data;
  },

  // Students
  getStudents: async () => {
    try {
      const response = await axios.get(`${API_URL}/students`);
      const students = response.data;
      setStoredData('students', students);
      return students;
    } catch (error) {
      console.log('Error fetching students from API, using localStorage:', error);
      return getStoredData('students');
    }
  },

  createStudent: async (student: Omit<Student, 'id'>) => {
    try {
      const response = await axios.post(`${API_URL}/students`, student);
      const students = getStoredData('students');
      const updatedStudents = [...students, response.data];
      setStoredData('students', updatedStudents);
      return response.data;
    } catch (error) {
      console.log('Error creating student:', error);
      throw error;
    }
  },

  deleteStudent: async (id: string) => {
    try {
      await axios.delete(`${API_URL}/students/${id}`);
      const students = getStoredData('students').filter((s: Student) => s.id !== id);
      setStoredData('students', students);
      return { success: true };
    } catch (error) {
      console.log('Error deleting student:', error);
      throw error;
    }
  },

  // Attendance
  getAttendance: async () => {
    try {
      const response = await axios.get(`${API_URL}/attendance`);
      const attendance = response.data;
      setStoredData('attendance', attendance);
      return attendance;
    } catch (error) {
      console.log('Error fetching attendance from API, using localStorage:', error);
      return getStoredData('attendance');
    }
  },

  markAttendance: async (records: Omit<AttendanceRecord, 'id'>[]) => {
    try {
      const response = await axios.post(`${API_URL}/attendance`, records);
      const attendance = getStoredData('attendance');
      const updatedAttendance = [...attendance, ...response.data];
      setStoredData('attendance', updatedAttendance);
      return response.data;
    } catch (error) {
      console.log('Error marking attendance:', error);
      // Store in localStorage even if API fails
      const attendance = getStoredData('attendance');
      const newRecords = records.map(record => ({
        ...record,
        id: crypto.randomUUID()
      }));
      const updatedAttendance = [...attendance, ...newRecords];
      setStoredData('attendance', updatedAttendance);
      return newRecords;
    }
  },
};