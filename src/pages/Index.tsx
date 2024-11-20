import { useState, useEffect } from 'react';
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
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { toast } = useToast();

  // Load stored data on component mount
  useEffect(() => {
    const storedStudents = localStorage.getItem('students');
    const storedAttendance = localStorage.getItem('attendance');
    
    if (storedStudents) {
      setStudents(JSON.parse(storedStudents));
    }
    if (storedAttendance) {
      setAttendance(JSON.parse(storedAttendance));
    }
  }, []);

  // Save data whenever it changes
  useEffect(() => {
    localStorage.setItem('students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('attendance', JSON.stringify(attendance));
  }, [attendance]);

  const handleStudentRegistration = (student: Student) => {
    setStudents((prev) => [...prev, student]);
    console.log('New student registered:', student);
  };

  const handleStudentDelete = (studentId: string) => {
    setStudents((prev) => prev.filter(student => student.id !== studentId));
    setAttendance((prev) => prev.filter(record => record.studentId !== studentId));
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
    
    if ((!email && !username) || !password) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all required fields",
      });
      return;
    }

    if (isLoginMode) {
      // Simulate login with either username or email
      if ((email === "admin@attenease.com" || username === "admin") && password === "admin") {
        setIsAuthenticated(true);
        toast({
          title: "Welcome to SmartAttend",
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
      if (!username) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Username is required for registration",
        });
        return;
      }
      setIsAuthenticated(true);
      toast({
        title: "Welcome to SmartAttend",
        description: "Account created successfully",
      });
    }

    setEmail('');
    setUsername('');
    setPassword('');
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-4xl font-bold text-center mb-8">SmartAttend</h1>
        <p className="text-center text-muted-foreground mb-8">
          Intelligent Attendance Management System
        </p>
        
        <div className="max-w-md mx-auto">
          <form onSubmit={handleAuth} className="space-y-4">
            {!isLoginMode && (
              <Input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            )}
            <Input
              type="text"
              placeholder={isLoginMode ? "Email or Username" : "Email"}
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
          <StudentRegistration 
            onRegister={handleStudentRegistration}
            onDelete={handleStudentDelete}
            students={students}
          />
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