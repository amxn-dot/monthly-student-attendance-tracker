import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import StudentsPage from "./pages/StudentsPage";
import AttendanceMarking from "./components/AttendanceMarking";
import AttendanceHistory from "./components/AttendanceHistory";
import AdminDashboard from "./components/AdminDashboard";
import DashboardLayout from "./components/DashboardLayout";
import { api } from "./lib/api";
import { useToast } from "./components/ui/use-toast";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const AppRoutes = () => {
  const { toast } = useToast();
  
  const { data: students = [] } = useQuery({
    queryKey: ['students'],
    queryFn: api.getStudents,
  });

  const { data: attendance = [] } = useQuery({
    queryKey: ['attendance'],
    queryFn: api.getAttendance,
  });

  const handleStudentUpdate = async (student: any) => {
    try {
      // Update student logic here
      console.log('Updating student:', student);
      toast({
        title: "Success",
        description: "Student updated successfully",
      });
    } catch (error) {
      console.error('Error updating student:', error);
      toast({
        title: "Error",
        description: "Failed to update student",
        variant: "destructive",
      });
    }
  };

  const handleAttendanceSubmit = async (records: any[]) => {
    try {
      await api.markAttendance(records);
      toast({
        title: "Success",
        description: "Attendance marked successfully",
      });
    } catch (error) {
      console.error('Error marking attendance:', error);
      toast({
        title: "Error",
        description: "Failed to mark attendance",
        variant: "destructive",
      });
    }
  };

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="/students" element={
        <ProtectedRoute>
          <StudentsPage />
        </ProtectedRoute>
      } />
      <Route path="/attendance" element={
        <ProtectedRoute>
          <DashboardLayout>
            <AttendanceMarking 
              students={students} 
              onSubmit={handleAttendanceSubmit}
            />
          </DashboardLayout>
        </ProtectedRoute>
      } />
      <Route path="/history" element={
        <ProtectedRoute>
          <DashboardLayout>
            <AttendanceHistory 
              students={students} 
              attendance={attendance}
            />
          </DashboardLayout>
        </ProtectedRoute>
      } />
      <Route path="/admin" element={
        <ProtectedRoute>
          <DashboardLayout>
            <AdminDashboard 
              students={students}
              attendance={attendance}
              onStudentUpdate={handleStudentUpdate}
            />
          </DashboardLayout>
        </ProtectedRoute>
      } />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;