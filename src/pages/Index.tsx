import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StudentRegistration from '@/components/StudentRegistration';
import AttendanceMarking from '@/components/AttendanceMarking';
import AttendanceHistory from '@/components/AttendanceHistory';
import AdminDashboard from '@/components/AdminDashboard';
import { Student, AttendanceRecord } from '@/types';

export default function Index() {
  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);

  const handleStudentRegistration = (student: Student) => {
    setStudents((prev) => [...prev, student]);
  };

  const handleAttendanceSubmit = (records: AttendanceRecord[]) => {
    setAttendance((prev) => [...prev, ...records]);
  };

  const handleStudentUpdate = (updatedStudent: Student) => {
    setStudents((prev) =>
      prev.map((student) =>
        student.id === updatedStudent.id ? updatedStudent : student
      )
    );
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold text-center mb-8">College Attendance System</h1>
      <Tabs defaultValue="register" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="register">Register Students</TabsTrigger>
          <TabsTrigger value="attendance">Mark Attendance</TabsTrigger>
          <TabsTrigger value="history">Attendance History</TabsTrigger>
          <TabsTrigger value="admin">Admin Dashboard</TabsTrigger>
        </TabsList>
        <TabsContent value="register">
          <StudentRegistration onRegister={handleStudentRegistration} />
        </TabsContent>
        <TabsContent value="attendance">
          <AttendanceMarking 
            students={students} 
            onSubmit={handleAttendanceSubmit} 
          />
        </TabsContent>
        <TabsContent value="history">
          <AttendanceHistory 
            students={students} 
            attendance={attendance} 
          />
        </TabsContent>
        <TabsContent value="admin">
          <AdminDashboard 
            students={students} 
            attendance={attendance}
            onStudentUpdate={handleStudentUpdate}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}