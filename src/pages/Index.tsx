import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import StudentRegistration from '@/components/StudentRegistration';
import AttendanceMarking from '@/components/AttendanceMarking';
import AttendanceHistory from '@/components/AttendanceHistory';
import AdminDashboard from '@/components/AdminDashboard';
import { Student, AttendanceRecord } from '@/types';
import { LogIn, UserPlus, Calendar, Users, ClipboardCheck, Settings } from "lucide-react";

export default function Index() {
  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { toast } = useToast();

  // Add the missing handler functions
  const handleStudentRegistration = (student: Student) => {
    setStudents((prev) => [...prev, student]);
    console.log('New student registered:', student);
  };

  const handleAttendanceSubmit = (records: AttendanceRecord[]) => {
    setAttendance((prev) => [...prev, ...records]);
    console.log('New attendance records:', records);
  };

  const handleStudentUpdate = (updatedStudent: Student) => {
    setStudents((prev) =>
      prev.map((student) =>
        student.id === updatedStudent.id ? updatedStudent : student
      )
    );
    console.log('Student updated:', updatedStudent);
  };

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (!email || !password) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all fields",
      });
      return;
    }

    if (isLoginMode) {
      // Simulate login
      if (email === "admin@attenease.com" && password === "admin") {
        setIsAuthenticated(true);
        toast({
          title: "Success",
          description: "Logged in successfully",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Invalid credentials",
        });
      }
    } else {
      // Simulate signup
      setIsAuthenticated(true);
      toast({
        title: "Success",
        description: "Account created successfully",
      });
    }

    setEmail('');
    setPassword('');
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-4xl font-bold text-center mb-8">AttenEase</h1>
        <p className="text-center text-muted-foreground mb-8">
          Smart Attendance Management System
        </p>
        
        <div className="max-w-md mx-auto">
          <form onSubmit={handleAuth} className="space-y-4">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="flex flex-col gap-2">
              <Button type="submit" className="w-full gap-2">
                {isLoginMode ? (
                  <>
                    <LogIn className="h-4 w-4" />
                    Login
                  </>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4" />
                    Sign Up
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => setIsLoginMode(!isLoginMode)}
              >
                {isLoginMode ? "Need an account? Sign Up" : "Already have an account? Login"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">AttenEase</h1>
        <Button 
          variant="outline" 
          onClick={() => setIsAuthenticated(false)}
          className="gap-2"
        >
          <LogIn className="h-4 w-4" />
          Logout
        </Button>
      </div>
      <Tabs defaultValue="register" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="register" className="gap-2">
            <Users className="h-4 w-4" />
            Register Students
          </TabsTrigger>
          <TabsTrigger value="attendance" className="gap-2">
            <ClipboardCheck className="h-4 w-4" />
            Mark Attendance
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-2">
            <Calendar className="h-4 w-4" />
            Attendance History
          </TabsTrigger>
          <TabsTrigger value="admin" className="gap-2">
            <Settings className="h-4 w-4" />
            Admin Dashboard
          </TabsTrigger>
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