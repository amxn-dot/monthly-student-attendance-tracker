export interface Student {
  id: string;
  name: string;
  rollNumber: string;
  class: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  date: string;
  isPresent: boolean;
}

export interface MonthlyAttendance {
  present: number;
  total: number;
  percentage: number;
}