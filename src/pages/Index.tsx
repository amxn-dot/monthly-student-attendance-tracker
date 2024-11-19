import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import StudentRegistration from '@/components/StudentRegistration';
import AttendanceMarking from '@/components/AttendanceMarking';
import AttendanceHistory from '@/components/AttendanceHistory';
import AdminDashboard from '@/components/AdminDashboard';
import { Student, AttendanceRecord } from '@/types';
import { LogIn, UserPlus } from "lucide-react";

export default function Index() {
  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-4xl font-bold text-center mb-8">AttenEase</h1>
        <p className="text-center text-muted-foreground mb-8">
          Smart Attendance Management System
        </p>
        <div className="flex justify-center gap-4">
          <Button onClick={() => setIsAuthenticated(true)} className="gap-2">
            <LogIn className="h-4 w-4" />
            Login
          </Button>
          <Button variant="outline" onClick={() => setIsAuthenticated(true)} className="gap-2">
            <UserPlus className="h-4 w-4" />
            Sign Up
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">AttenEase</h1>
        <Button variant="outline" onClick={() => setIsAuthenticated(false)}>
          Logout
        </Button>
      </div>
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